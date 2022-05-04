import "colors";

export default class sott_console {
    /**
     * Error message
     * @param {string} message 
     * @param {string} error 
     */
    static error(message: string, error: null | string = null) {
        console.error("⛔", message.red);
        throw error;
    }

    /**
     * Warning message
     * @param {string} message 
     */
    static warning(message: string) {
        console.warn("⚡", message.yellow);
    }

    /**
     * Deprecation error, for when a feature is not yet implemented.
     * @param {string} feature 
     * @param {string} feature_status
     */
    static deprecation_warning(feature: string, feature_status: string) {
        console.warn("⚡🍼", "Feature ".yellow + feature.green + " is marked as ".yellow + feature_status.green + " and does not yet work in krdom.".yellow);
    }

    /**
     * Path error, for when a path can not be found in referencing path
     * @param {string} origin_path 
     * @param {string} error_path
     */
    static path_warning(origin_path: string, error_path: string) {
        console.warn("⚡📂", "Path \"".yellow + origin_path.magenta + "\" could not be found, and will not be imported. (Referenced in file: \"".yellow + error_path.magenta + "\")".yellow);
    }

    /**
     * Info message
     * @param {string} message 
     */
    static info(message: string) {
        console.info("❔", message.blue);
    }

    /**
     * Succes message
     * @param {string} message 
     */
    static success(message: string) {
        console.log("✅", message.green)
    }

    /**
     * Console spacing 
     * @param {number} amount amount of spaces
     */
    static spacing(amount: number = 1) {
        while (amount--) {
            console.log();
        }
    }
}