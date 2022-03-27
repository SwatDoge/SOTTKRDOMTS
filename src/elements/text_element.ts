import IKRDom_element, * as IKRDom from "../interfaces/krdom";
import element from "../element";
import {IHTMLJSON, IStyleSheet} from "../interfaces/parsing";

export default class text_element extends element {
    public type: IKRDom.element_type = "text";
    public data: IKRDom.data_types

    constructor(_element: IHTMLJSON, parent: string, stylesheets: IStyleSheet[], inline_style: IStyleSheet, text: string){
        super(_element, parent, stylesheets, inline_style);
        this.data = ({text: this.clean_string(text)} as IKRDom.text_data);
    }

    clean_string(string: string): string{
        return string
        //remove newlines and tabs
        .replace(/^[\n|\r|\t]+$/gmi, "")
        //remove duplicate spaces
        .replace(/\s{2,}/gmi, " ");
    }
}