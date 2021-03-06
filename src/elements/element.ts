import IKRDom_element, * as IKRDom from "../interfaces/krdom";
import { IHTMLJSON, IHTMLJSON_atributes, IStyleSheet, IHeadlessSheet } from "../interfaces/parsing";
import { randomUUID } from "crypto";
import fs from "fs";
import shared_resources from "../shared_resources";

export default class element {
    public type: IKRDom.element_type = "element";
    public id: string;
    public parent: string;
    public style: IStyleSheet;
    public data: IKRDom.data_types;

    public dom_id: string[];
    public dom_class: string[];

    /**
     * Creates an element
     * @param _element 
     * @param shared_resources 
     * @param parent 
     * @param stylesheets 
     * @param inline_style 
     */
    constructor(_element: IHTMLJSON, shared_resources: shared_resources, file_path: string, parent: string, stylesheets: IStyleSheet[], inline_style: IHeadlessSheet) {
        this.parent = parent;
        this.id = element.generate_name(_element?.tag ?? "div") as string;
        this.style = this.generate_element_style(_element, stylesheets, inline_style);
    }

    generate_element_style(_element: IHTMLJSON, stylesheets: IStyleSheet[], inline_style: IHeadlessSheet): IStyleSheet {
        let style: object = {};
        const stylesheet: IStyleSheet = Object["objectAssign"](...stylesheets as [IStyleSheet]);

        const selector_patterns: RegExp[] = [
            new RegExp(`(^|(.*)\\,\\s?)\\*(\\,\\s?(.*)|$|\\s*\\{)`, "gmi"),                //any selector
            new RegExp(`(^|(.*)\\,\\s?)${_element.tag}(\\,\\s?(.*)|$|\\s*\\{)`, "gmi"),    //tag selector
        ];

        this.dom_class = element.get_attribute(_element.attr, "class");
        this.dom_id = element.get_attribute(_element.attr, "id");

        const classes = this.dom_class.map(x => "." + x).join("|");
        const ids = this.dom_id.map(x => "#" + x).join("|");

        if (classes.length > 0) selector_patterns.push(new RegExp(`(^|(.*)\\,\\s?)(${classes})(\\,\\s?(.*)|$|\\s*\\{)`, "mig"));   //class selector
        if (ids.length > 0) selector_patterns.push(new RegExp(`(^|(.*)\\,\\s?)(${ids})(\\,\\s?(.*)|$|\\s*\\{)`, "mig"));           //id selector

        for (const selector of selector_patterns) {
            for (const [key, value] of Object.entries(stylesheet)) {
                if (selector.test(key)) {
                    style = Object["objectAssign"](style, value);
                }
            }
        }

        style = Object["objectAssign"](style, inline_style);

        return style as IStyleSheet;
    }

    static get_attribute(_element: IHTMLJSON_atributes, key: string): string[] {
        if (!_element?.[key]) return [];
        return typeof _element[key] == "string" ? [_element[key]] : _element[key] as string[];
    }

    static generate_name(tag: string) {
        return `${tag}_${randomUUID().replace(/-/g, "")}`;
    }
}