import element from "./element";
import {IHTMLJSON, IHTMLJSON_atributes, IStyleSheet} from "../interfaces/parsing";
import shared_resources from "../shared_resources";

import anchor_element from "./anchor_element";

export default function element_builder(_element: IHTMLJSON, shared_resources: shared_resources, file_path: string, parent: string, stylesheets: IStyleSheet[], inline_style: IStyleSheet){

    const args: [IHTMLJSON, shared_resources, string, string, IStyleSheet[], IStyleSheet] = [_element, shared_resources, file_path, parent, stylesheets, inline_style];
    switch(_element.tag.toLowerCase()){
        case "a": return new anchor_element(...args);
        default: return new element(...args);
    }
}
