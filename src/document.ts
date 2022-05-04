import fs from "fs";
import { html2json as html_to_json } from "html2json";
import { toJSON as css_to_json } from "cssjson";
import path from "path";
import sott_console from "./utils/console";
import shared_resources_type from "./shared_resources";
import element from "./elements/element";

//import create_krdom_element from "./elements/element"
import create_krdom_element from "./elements/element_builder"
import create_krdom_text_element from "./elements/text_element"

import IKRDom_element, * as IKRDom from "./interfaces/krdom";
import { IStyleSheet, IHTMLJSON, ICSSJSON, IParsedDocument, IHeadlessSheet } from "./interfaces/parsing"

export default class document {

    cwd: string;
    file_path: string;
    argv: string[];
    is_index: boolean;

    title: string;
    style: IStyleSheet[];
    anchors: string[];

    shared_resources: shared_resources_type;

    constructor(cwd: string, file_path: string, argv: string[], shared_resources, is_index = false) {
        this.cwd = cwd;
        this.file_path = file_path;
        this.argv = argv;
        this.is_index = is_index;

        this.shared_resources = shared_resources;

        this.style = [this.import_css(path.join(global.src, "./constants/index.css"))];
    }

    parse(): IKRDom.IKRDom_document_element[] {
        const document_array = [];
        const file_content = fs.readFileSync(this.file_path, { encoding: "utf8" });
        const parsed_document = this.document_parse(this.html_parse(file_content));

        if (parsed_document.body) {
            document_array.push({
                id: this.shared_resources.resource("document", this.file_path, true).refer,
                type: "document",
                shown: this.is_index,
                title: this.title,
                data: {
                    content: this.recussive_build(parsed_document.body, "SOTT_CANVAS")
                } as IKRDom.document_data,
            });

            let resource_documents = Array.from(this.shared_resources.resources.get("document"));
            while (resource_documents.some(resource => !resource[1].loaded)) {
                let unloaded_documents = resource_documents.filter(resource => !resource[1].loaded);
                let new_document = new document(this.cwd, unloaded_documents[0][0], this.argv, this.shared_resources, false).parse();
                document_array.push(...new_document);
                resource_documents = Array.from(this.shared_resources.resources.get("document"));
            }
            return document_array;
        }
        return [];
    }

    /**
     * 
     * @param {IKRDom.IKRDom_document_element[]} build 
     * @returns 
     */
    static strip_krdom_element(build: IKRDom.IKRDom_document_element[]): string {
        const string_array = ["dom_class", "dom_id"];
        const object_array = ["data", "content"];

        return "obj" + JSON.stringify(build)
            //string arrays
            .replace(new RegExp(`(\\"(${string_array.join("|")})\\":)\\[`, "g"), "$1str[")

            //object arrays
            .replace(new RegExp(`(\\"(${object_array.join("|")})\\":)\\[`, "g"), "$1obj[")

            .replace(/-/g, "_20")
            .replace(/'/g, "\\'")

            //remove stringified object keys
            .replace(/"(\w+)":/gi, "$1:") + ";";
    }

    /**
     * @param {IHTMLJSON} element 
     * @param {string} parent 
     * @returns 
     */
    recussive_build(element: IHTMLJSON, parent: string, clickable: boolean = true): IKRDom_element[] {
        let node_array: IKRDom_element[] = [];
        let inline_style = this.parse_inline_css(element?.attr?.style ?? "");
        if (!clickable) {
            inline_style = Object.assign(inline_style, { "pointer-events": "none" });
        }

        if (element.node == "element" || element.node == "text") {
            if (element.node == "text") {
                element.tag = "inline";
                const krdom_element: IKRDom_element = new create_krdom_text_element(element, this.shared_resources, this.file_path, parent, this.style, inline_style, element.text);
                node_array.push(krdom_element);
            }

            if (element.node == "element") {
                const krdom_element: IKRDom_element = create_krdom_element(element, this.shared_resources, this.file_path, parent, this.style, inline_style);

                node_array.push(krdom_element);
                if (element.child?.length > 0) {
                    for (const child of element.child) {
                        node_array.push(...this.recussive_build(child, krdom_element.id, krdom_element.clickable_children ?? clickable));
                    }
                }
            }
            return node_array;
        }
        else if (element.node == "root") {
            sott_console.error("Unexpected root, please contact Swat#7165 on discord if you get this error");
        }

        return node_array;
    }

    /**
     * Parse css in string format
     * @param {string} inline_css 
     * @returns 
     */
    parse_inline_css(inline_css: string | string[]): IHeadlessSheet {
        let css = typeof inline_css == "string" ? inline_css : inline_css.join("");
        let content: IHeadlessSheet = {};
        try {
            const attributes = css.replace(/;/gm, "").split(":");
            if (attributes.length % 2 === 0) {
                for (let index = 0; index < attributes.length; index += 2) {
                    content[attributes[index]] = attributes[index + 1];

                }
            }
        }
        catch {
            sott_console.warning(`Failed to parse stylesheet into styling <inline element styling> in ${this.file_path}, ignoring file`);
        }

        return content;
    }

    /**
     * Parse HTML string into JSON
     * @param {string} content
     * @returns {IHTMLJSON}
     */
    html_parse(content: string): IHTMLJSON {
        const safe_content: string = content.replace(/<!(.*)>/gi, "");
        let parsed_content: object = null;

        if (safe_content != content) {
            sott_console.warning(`Try to avoid the DOCTYPE tag, HTML comments, or other <!> tags. They get automatically filtered, but could possibly lead to issues`)
        }

        try {
            parsed_content = html_to_json(safe_content);
        }
        catch (e) {
            sott_console.error(`Could not parse HTML at "${this.file_path}". Make sure to stick to HTML standards while writing, check error for further debugging, or contact Swat#7165 on discord`, e);
        }

        return parsed_content as IHTMLJSON;
    }

    /**
     * Parse document head and body tags to create readable json html
     * @param {IHTMLJSON} content 
     * @returns {IParsedDocument}
     */
    document_parse(content: IHTMLJSON): IParsedDocument {
        const root_elements = content.child.filter(child => child.node == "element");
        const html_elements = root_elements.filter(child => child.tag == "html");
        let body_elements = root_elements.filter(child => child.tag == "body");
        let head_elements = root_elements.filter(child => child.tag == "head");

        let body: IHTMLJSON;
        let head: IHTMLJSON;
        let html: IHTMLJSON;

        if (root_elements.length < 0) {
            sott_console.warning(`No elements were found at ${this.file_path}, did you link to an empty file?`)
        }

        if (html_elements.length <= 0) {
            sott_console.info(`Can not find direct html tags, looking for direct body/head tags (${this.file_path})`);
            head = this.merge_tags(head_elements, "head");
            body = this.merge_tags(body_elements, "body");

            if (!head) {
                sott_console.info(`Did not find any initial head tags, unable to import head (${this.file_path})`);
            }

            if (!body) {
                sott_console.info(`Did not find any initial body tags, unable to import body (${this.file_path})`);
            }

            if (!body && !head) {
                sott_console.warning(`File ${this.file_path} does not stick to standard html structure, and was unable to import anything`);
            }
        }
        else {
            html = this.merge_tags(html_elements, "html");

            body_elements = html.child.filter(child => child.tag == "body");
            head_elements = html.child.filter(child => child.tag == "head");

            if (head_elements.length <= 0) {
                sott_console.info(`Did not find any head tags, unable to import head (${this.file_path})`);
            }
            else {
                head = this.merge_tags(head_elements, "head");
            }

            if (body_elements.length <= 0) {
                sott_console.info(`Did not find any body tags, unable to import body (${this.file_path})`);
            }
            else {
                body = this.merge_tags(body_elements, "body");
            }

            if (!body && !head) {
                sott_console.warning(`File ${this.file_path} does not stick to standard html structure, and was unable to import anything`);
            }
        }

        //Get title and stylings from head tag.
        if (Object.keys(head).length > 0) {
            //nice and compact one liner to get the last title
            this.title = head.child.filter(child => child.tag == "title").map(child => child.child.filter(node => node.node == "text")).filter(titles => titles.at(-1))?.at(-1)?.at(-1)?.text ?? "My website";

            let inline_style = 0;
            for (const child of head.child) {
                if (child.tag == "style" && child.node == "element" && child?.child?.[0]?.node == "text") {
                    inline_style++;
                    this.style.push(this.parse_css(child.child[0].text, `<inline styling #${inline_style}>`));
                }
                else if (child.tag == "link", child.node == "element" && child?.attr?.rel == "stylesheet" && child?.attr?.href) {
                    this.style.push(...element.get_attribute(child?.attr, "href").map(x => this.import_css(x)));
                }
            }
        }

        let parsed_document: IParsedDocument = { head, body }
        return parsed_document;
    }

    /**
     * Import css from a file path
     * @param {string} css_path 
     * @returns {IStyleSheet}
     */
    import_css(css_path: string): IStyleSheet {
        let content: string;

        try {
            content = fs.readFileSync(css_path, { encoding: "utf-8" });
        }
        catch (e) {
            sott_console.warning(`Failed to read stylesheet ${css_path} in ${this.file_path}, ignoring file`);
            return {}
        }

        return this.parse_css(content, css_path);
    }

    /**
     * Convert string value to json stylesheet
     * @param {string} json_css 
     * @param {string} path 
     * @returns {IStyleSheet}
     */
    parse_css(json_css: string, path: string, attributes: boolean = false): IStyleSheet {
        let content: ICSSJSON;
        try {
            content = css_to_json(json_css.replace(/\s{2,}|\n|\r/g, "").replace(/\/\*(.*?)\*\//g, ""));
        }
        catch {
            sott_console.warning(`Failed to parse stylesheet into styling ${path} in ${this.file_path}, ignoring file`);
            return {};
        }
        let css_object = {} as IStyleSheet;

        if (attributes) {
            for (const entry of Object.entries(content.attributes)) {
                css_object[entry[0]] = entry[1];
            }
        }
        else {
            for (const entry of Object.entries(content.children)) {
                css_object[entry[0]] = entry[1].attributes;
            }
        }

        return css_object;
    }

    /**
     * If there is more then two of the same tag, merge them into one (used for head, body and html tags)
     * @param {string} elements 
     * @param {string} tag 
     * @returns {IHTMLJSON}
     */
    merge_tags(elements: IHTMLJSON[], tag: string): IHTMLJSON {
        let merge: IHTMLJSON = {} as IHTMLJSON;
        if (elements.length <= 0) {
            return {} as IHTMLJSON;
        }
        if (elements.length > 1) {
            sott_console.info(`Several ${tag} elements found, attempting to merge in file (${this.file_path})`);
            merge = Object["objectAssign"](merge, ...elements);
            merge.child = [].concat(...elements.map(element => element.child));
        }
        else {
            merge = elements[0];
        }

        return merge;
    }
}