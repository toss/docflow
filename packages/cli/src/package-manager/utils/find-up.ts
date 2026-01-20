import path from "path";
import { getWorkingDirectory } from "../../utils/get-working-directory.js";
import fs from "fs";

export function findUp(name: string, cwd = getWorkingDirectory()) {
    const absoluteCwd = path.resolve(cwd);
    const file = path.join(absoluteCwd, name);
    if (fs.existsSync(file)) {
        return file;
    }

    const { root } = path.parse(absoluteCwd);
    if (absoluteCwd == root) {
        return undefined;
    }

    return findUp(name, path.dirname(absoluteCwd));
}