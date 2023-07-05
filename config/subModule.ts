// 分包构建部署
import { readFileSync, readdirSync, existsSync, PathLike } from 'fs'
import { resolve } from "path";

function findSubFile(e: PathLike, mode: string, dirname: string) {
    let build = {}, root = resolve(dirname, ""), theme = {};
    const dirents = readdirSync(e, { withFileTypes: true });
    for(const element of dirents) {
        let suffilex = element.name.replace('Routes', '')
        if([`${suffilex}_development`, `${suffilex}_pre`, `${suffilex}_production`].includes(mode)) {
            build = {
                outDir: resolve(dirname, `dist_${suffilex}`),
                rollupOptions: {
                    input: resolve(dirname, `${e}/${element.name}/index.html`)
                },
                emptyOutDir: true
            };
            root = resolve(dirname, `${e}/${element.name}`);
            if(existsSync(`${e}/${element.name}/theme.json`)) {
                theme = JSON.parse(readFileSync(`${e}/${element.name}/theme.json`, 'utf8')).theme;
            }
            break;
        }
    }
    return { build, root, theme }
}

export const subModule = (key: string, subPath: string, mode: string, dirname: string) => {
    if(subPath == '') return
    const res = findSubFile(subPath, mode, dirname)
    return res[key]
}

export const getPublicDir = (mode: string, dirname: string) => {
    switch (mode) {
        case 'main_development':
        case 'main_pre':
        case 'main_production':
            return resolve(dirname, "./public/main")
        case 'st_development':
        case 'st_pre':
        case 'st_production':
            return resolve(dirname, "./public/shitai")
        default:
            return resolve(dirname, "./public/all")

    }
}