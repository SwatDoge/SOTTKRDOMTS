#!/usr/bin/env node
import fs from "fs";
import path from "path";
import process from "process";
import sott_console from "./utils/console";
import file_validator from "./utils/directory_utils";
import * as clipboard from "copy-paste"
import shared_resources from "./shared_resources"

import document_loader from "./document";

//#region
Object["objectAssign"] = function (target: object, ...args: object[]): object {
    let dummy = target ?? {};
    for (const obj of args) {
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value == "object") {
                dummy[key] = Object["objectAssign"](dummy[key], value);
            }
            else {
                dummy[key] = value;
            }
        }
    }
    return dummy;
}
//#endregion

global.src = path.join(path.resolve(__dirname), "../src/") as string;

sott_console.spacing();
sott_console.info("Starting generation...");
sott_console.spacing();

const argv: string[] = process.argv;
const cwd: string = process.cwd();

const entry: string = file_validator.find_entry(cwd, "index.html", 4);

if (fs.existsSync(entry)) {
    sott_console.success("Found entry file " + entry);

    if (entry != path.join(cwd, "index.html")) {
        sott_console.warning("Entry file is in sub-directory of given directory");
    }
}
else {
    sott_console.error("No entry file found");
}

const resources = new shared_resources();
clipboard.copy(document_loader.strip_krdom_element(new document_loader(cwd, entry, argv, resources, true).parse()), () => { });