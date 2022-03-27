import fs from "fs";
import {html2json as html_to_json} from "html2json";
import {toJSON as css_to_json} from "cssjson";
import path from "path";
import sott_console from "./utils/console";
import * as clipboard from "copy-paste"

import create_krdom_element from "./element"
import create_krdom_text_element from "./elements/text_element"

import IKRDom_element, * as IKRDom from "./interfaces/krdom";
import {IStyleSheet, IHTMLJSON, ICSSJSON, IParsedDocument} from "./interfaces/parsing"

export default class document {

    cwd: string;
    file_path: string;
    argv: string[];

    title: string;
    style: IStyleSheet[];
    anchors: string[]
    

    constructor(cwd: string, file_path: string, argv: string[]) {
        this.cwd = cwd;
        this.file_path = file_path;
        this.argv = argv;
        
        this.style = [this.import_css(path.join(global.src, "./constants/index.css"))];
    }

    parse() {
        const file_content = fs.readFileSync(this.file_path, {encoding: "utf8"});
        const parsed_document = this.document_parse(this.html_parse(file_content));

        if (parsed_document.body){
            clipboard.copy(this.strip_krdom_element(this.recussive_build(parsed_document.body, "SOTT_CANVAS")), () => {});
        }
    }

    strip_krdom_element(build: IKRDom_element[]){
        return "obj" + JSON.stringify(build)
        //replace dashes
        .replace(/-/g, "_20")
        .replace(/'/g, "\\'")
        //remove stringified object keys
        .replace(/"(\w+)":/gi, "$1:") + ";"
        //remove newlines,tabs and excessive spaces
        //.replace(/^[\n\r\t\s]+$/gmi, "");;
    }

    recussive_build(element: IHTMLJSON, parent: string): IKRDom_element[] {
        let node_array: IKRDom_element[] = [];
        let inline_style = this.parse_inline_css(element?.attr?.style ?? "");

        if (element.node == "element" || element.node == "text"){
            if (element.node == "text") {
                element.tag = "inline";
                const krdom_element: IKRDom_element = new create_krdom_text_element(element, parent, this.style, inline_style, element.text);
                node_array.push(krdom_element);
            }
            
            if (element.node == "element"){
                const krdom_element: IKRDom_element = new create_krdom_element(element, parent, this.style, inline_style);
                
                node_array.push(krdom_element);
                if (element.child?.length > 0){
                    for (const child of element.child) {
                        node_array.push(...this.recussive_build(child, krdom_element.id));
                    }
                }
            }

            return node_array;
        }
        else if (element.node == "root"){
            sott_console.error("Unexpected root, please contact Swat#7165 on discord if you get this error");
        }

        return node_array;
    }

    parse_inline_css(inline_css: string | string[]): IStyleSheet{
        
        let css = typeof inline_css == "string" ? inline_css : inline_css.join("");
        return this.parse_css("{" + css + "}", "<inline element styling>", true);
    }
    
    /**
     * Parse HTML string into JSON
     * @param {string} content
     * @returns {IHTMLJSON}
     */
    html_parse(content: string): IHTMLJSON {
        const safe_content: string = content.replace(/<!(.*)>/gi, "");
        let parsed_content: object = null;
        
        if (safe_content != content){
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

            if (!body && !head){
                sott_console.warning(`File ${this.file_path} does not stick to standard html structure, and was unable to import anything`);
            }
        }
        else {
            html = this.merge_tags(html_elements, "html");

            body_elements = html.child.filter(child => child.tag == "body");
            head_elements = html.child.filter(child => child.tag == "head");

            if (head_elements.length <= 0){
                sott_console.info(`Did not find any head tags, unable to import head (${this.file_path})`);
            }
            else {
                head = this.merge_tags(head_elements, "head");
            }

            if (body_elements.length <= 0){
                sott_console.info(`Did not find any body tags, unable to import body (${this.file_path})`);
            }
            else {
                body = this.merge_tags(body_elements, "body");
            }

            if (!body && !head){
                sott_console.warning(`File ${this.file_path} does not stick to standard html structure, and was unable to import anything`);
            }
        }

        //Get title and stylings from head tag.
        if (Object.keys(head).length > 0){
            //nice and compact one liner to get the last title
            this.title = head.child.filter(child => child.tag == "title").map(child => child.child.filter(node => node.node == "text")).filter(titles => titles.at(-1))?.at(-1)?.at(-1)?.text ?? "My website";
            
            let inline_style = 0;
            for (const child of head.child){
                if (child.tag == "style" && child.node == "element" && child?.child?.[0]?.node == "text"){
                    inline_style++;
                    this.style.push(this.parse_css(child.child[0].text, `<inline styling #${inline_style}>`));
                }
                else if (child.tag == "link", child.node == "element" && child?.attr?.rel == "stylesheet" && child?.attr?.href){
                    this.style.push(this.import_css(child?.attr?.href))
                }
            }
        }

        let parsed_document: IParsedDocument = {head, body}
        return parsed_document;
    }

    /**
     * Import css from a file path
     * @param {string} css_path 
     * @returns {IStyleSheet}
     */
    import_css(css_path: string): IStyleSheet{
        let content: string;

        try {
            content = fs.readFileSync(css_path, {encoding: "utf-8"});
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
    parse_css(json_css: string, path: string, attributes: boolean = false): IStyleSheet{
        let content: ICSSJSON;

        try {
            content = css_to_json(json_css.replace(/\s*/g, "").replace(/\/\*(.*?)\*\//g, ""));
        }
        catch {
            sott_console.warning(`Failed to parse stylesheet into styling ${path} in ${this.file_path}, ignoring file`);
            return {};
        }
        let css_object = {} as IStyleSheet;

        if (attributes){
            for (const entry of Object.entries(content.attributes)){
                css_object[entry[0]] = entry[1];
            }
        }
        else {
            for (const entry of Object.entries(content.children)){
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