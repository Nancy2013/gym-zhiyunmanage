// 指令执行服务
const { readdirSync } = require("fs");
const inquirer = require("inquirer");
const util = require("util");
const child_process = require("child_process");
const spawn = util.promisify(child_process.spawn);

function viteServers(path) {
    const dirents = readdirSync(path, { withFileTypes: true });
    inquirer.prompt([
        {
            type: 'list',
            name: 'type',
            message: '选择执行环境',
            choices: ['dev', 'pre', 'pro']
        }
    ]).then((res) => {
        let server = res.type;
        inquirer.prompt([
            {
                type: 'list',
                name: 'type',
                message: '选择执行服务',
                choices: ['global'].concat(dirents.map(ele => ele.name.replace('Routes', '')))
            }
        ]).then((res) => {
            switch(server) {
                case 'dev': spawn(res.type == 'global' ? `vite --host` : `vite --mode ${res.type}_development`, {stdio:'inherit', shell:true }); break;
                case 'pre': spawn(res.type == 'global' ? `vue-tsc --noEmit && vite build` : `vue-tsc --noEmit && vite build --mode ${res.type}_pre`, {stdio:'inherit', shell:true }); break;
                case 'pro': spawn(res.type == 'global' ? `vue-tsc --noEmit && vite build` : `vue-tsc --noEmit && vite build --mode ${res.type}_production`, {stdio:'inherit', shell:true }); break;
                default:break;
            }
            
        })
    })
}

viteServers('src/layouts')