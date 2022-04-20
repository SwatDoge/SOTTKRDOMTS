import element from "./elements/element";

export default class resources {
    public resources = new Map<string, Map<string, resource>>();

    constructor(){
        this.resources.set("document", new Map<string, resource>());
    }

    /**
     * get, set or create value of a resource.
     * @param {string} type
     * @param {string} absolute_path_name 
     * @param {string} fallback_href 
     * @returns {resource}
     */
    resource(type: string, absolute_path_name: string, loaded = false, fallback_href: string = null): resource {
        if (!this.resources.has(type)){
            console.error("Illegal type \"" + type + "\" in shared resources. This is a programming mistake, and must be reported to a developer.");
        }

        const resource_map = this.resources.get(type);

        if (!resource_map.has(absolute_path_name)){
            resource_map.set(absolute_path_name, {refer: fallback_href ?? element.generate_name("document"), loaded: false});
        }

        if (loaded){
            resource_map.get(absolute_path_name).loaded = true;
        }

        return {
            refer: resource_map.get(absolute_path_name).refer ?? fallback_href,
            loaded: resource_map.get(absolute_path_name).loaded
        } as resource
    }
}

interface resource {
    refer: string,
    loaded: boolean
}