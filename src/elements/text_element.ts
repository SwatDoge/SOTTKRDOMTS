import IKRDom_element, * as IKRDom from "../interfaces/krdom";
import element from "./element";
import { IHTMLJSON, IStyleSheet, IHeadlessSheet } from "../interfaces/parsing";
import shared_resources from "../shared_resources";

export default class text_element extends element {
    public type: IKRDom.element_type = "text";
    public data: IKRDom.data_types

    constructor(_element: IHTMLJSON, shared_resources: shared_resources, file_path: string, parent: string, stylesheets: IStyleSheet[], inline_style: IHeadlessSheet, text: string) {
        super(_element, shared_resources, file_path, parent, stylesheets, inline_style);
        this.data = ({ text: this.clean_string(text) } as IKRDom.text_data);
    }

    clean_string(string: string): string {
        return string
            //remove newlines and tabs
            .replace(/^[\n|\r|\t]+$/gmi, "")
            //remove duplicate spaces
            .replace(/\s{2,}/gmi, " ");
    }
}