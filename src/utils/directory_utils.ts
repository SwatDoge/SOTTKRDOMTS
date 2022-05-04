import path from "path";
import fs, { readdirSync } from "fs";

export default class file_validator {
    static find_entry(file_path: string, file: string, depth: number): (undefined | string) {
        const result_path: string = path.join(file_path, file);

        if (depth <= 0) {
            return;
        }

        if (fs.existsSync(result_path) && !fs.lstatSync(result_path).isDirectory()) {
            return result_path;
        }

        const subdirectories = readdirSync(file_path, { withFileTypes: true }).filter(subdir => subdir.isDirectory());

        for (const dir of subdirectories) {
            let succes_path = this.find_entry(path.join(file_path, dir.name), file, depth - 1);
            if (succes_path) return succes_path;
        }
    }
}