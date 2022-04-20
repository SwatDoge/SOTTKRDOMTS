import IKRDom_element, * as IKRDom from "../interfaces/krdom";
import element from "./element";
import {IHTMLJSON, IStyleSheet} from "../interfaces/parsing";
import shared_resources from "../shared_resources"
import sott_console from "../utils/console";
import fs from "fs";
import path from "path";

export default class anchor_element extends element {
    public type: IKRDom.element_type = "anchor";
    public data: IKRDom.data_types;
    clickable_children: boolean = false;

    constructor(_element: IHTMLJSON, shared_resources: shared_resources, file_path: string, parent: string, stylesheets: IStyleSheet[], inline_style: IStyleSheet){
        super(_element, shared_resources, file_path, parent, stylesheets, inline_style);
        const refers = element.get_attribute(_element.attr, "href");

        if (refers.length < 1) {
            sott_console.warning(`Missing href attribute in anchor tag, it wont direct anywhere. (${file_path})`);
            return;
        } 
        else if (refers.length > 1) {
            sott_console.warning(`Too many href attributes in anchor tag, using the first working one. (${file_path})`);
        }

        let available_path = null;
        for (let ref of refers){
            let ref_links = path.resolve(path.dirname(file_path), ref);
            if (fs.existsSync(ref_links)){
                available_path = ref_links;
                break;
            }
        }

        if (!available_path){
            sott_console.warning(`Path(s) in ref attribute of anchor does not exist, it will not direct to anything. (${file_path}) / (${refers.join(", ")})`);
        }
        else {
            this.data = {
                refer: shared_resources.resource("document", available_path, false).refer
            }
        }
    }
}