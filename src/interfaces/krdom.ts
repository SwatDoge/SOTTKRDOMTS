import { IStyleSheet } from "./parsing"

export type data_types = text_data | anchor_data | image_data | document_data;
export type element_type = "element" | "text" | "anchor" | "document";

export default interface IKRDom_element {
    id: string;
    parent: string;
    type: element_type;
    style: IStyleSheet;
    clickable_children?: boolean;
    data?: data_types;

    dom_id?: string[];
    dom_class?: string[];
}

export interface IKRDom_document_element {
    id: string;
    type: element_type;
    data?: data_types;
    shown: boolean;
}

export interface text_data {
    text: string;
}

export interface anchor_data {
    refer: string;
}

export interface image_data {
    width?: string;
    height?: string;
    resource_id: string;
}

export interface document_data {
    content?: IKRDom_element[];
}