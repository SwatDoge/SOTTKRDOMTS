export interface IParsedDocument{
    head?: IHTMLJSON;
    body?: IHTMLJSON;
}

export interface IHTMLJSON_atributes{
    class?: string | string[];
    id?: string | string[];
    style?: string | string[];
    href?: string;
    rel?: string;
}

export interface IHTMLJSON{
    node: "root" | "text" | "element";
    child?: IHTMLJSON[];
    attr?: IHTMLJSON_atributes;
    text?: string;
    tag?: string;
}

export interface ICSSJSON{
    children: object;
    attributes: ICSSJSON;
}

export interface IStyleSheet{
    [key: string]: object;
}