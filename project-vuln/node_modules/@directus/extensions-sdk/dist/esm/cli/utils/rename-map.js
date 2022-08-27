import path from 'path';
import fse from 'fs-extra';
export default async function renameMap(file, map) {
    const info = await fse.stat(file);
    if (info.isFile()) {
        const newName = map(path.basename(file));
        if (newName !== null) {
            fse.rename(file, path.join(path.dirname(file), newName));
        }
    }
    else {
        const subFiles = await fse.readdir(file);
        for (const subFile of subFiles) {
            await renameMap(path.join(file, subFile), map);
        }
    }
}
