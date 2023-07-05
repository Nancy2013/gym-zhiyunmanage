// 分包服务创建
const { mkdirSync, writeFileSync, readFileSync, readdirSync } = require("fs");
const inquirer = require("inquirer");

/**
 * 模板数据操作
 * @param publicDir
 * @param templatePath
 * @param suffiex
 */

// vue模板
const templateVue = (publicDir, templatePath, suffiex) => {
  let getVue = readFileSync(`${templatePath}/pages/index.txt`, "utf-8").replace(
    /package/g,
    `${suffiex}_package`
  );
  writeFileSync(`${publicDir}/pages/index.vue`, getVue, "utf-8");
};

// html模板
const templateHtml = (publicDir, templatePath, projectName) => {
  let getHtml = readFileSync(`${templatePath}/index.txt`, "utf-8").replace(
    "<title></title>",
    `<title>${projectName}</title>`
  );
  writeFileSync(`${publicDir}/index.html`, getHtml, "utf-8");
};

// main.ts模板
const templateMain = (publicDir, templatePath) => {
  let getMain = readFileSync(`${templatePath}/main.txt`, "utf-8");
  writeFileSync(`${publicDir}/main.ts`, getMain, "utf-8");
};

// router模板
const templateRouter = (type, publicDir, templatePath, suffiex) => {
  switch (type) {
    case "config":
      let getRouterConfig = readFileSync(
        `${templatePath}/router/config.txt`,
        "utf-8"
      ).replace(/_/g, `${suffiex}`);
      writeFileSync(`${publicDir}/router/config.ts`, getRouterConfig, "utf-8");
      break;
    case "index":
      let getRouterIndex = readFileSync(
        `${templatePath}/router/index.txt`,
        "utf-8"
      ).replace(/_/g, `${suffiex}`);
      writeFileSync(`${publicDir}/router/index.ts`, getRouterIndex, "utf-8");
      break;
  }
};

async function buildSubpages(path) {
  let publicDir = "";
  const dirname = __dirname.replace("config", "");
  const templatePath = "config/template";
  const dirents = readdirSync("src/layouts", { withFileTypes: true });
  await inquirer
    .prompt([
      {
        type: "input",
        name: "suffiex",
        message: "请定义分包服务名",
      },
    ])
    .then((res) => {
      let { suffiex } = res;
      publicDir = `${dirname}/${path}/${suffiex}Routes`;
      if (
        dirents.some((element) => element.name.replace("Routes", "") == suffiex)
      ) {
        console.error("该服务已存在，不能重复创建!");
      } else {
        mkdirSync(publicDir);
        ["pages", "router"].forEach((element) =>
          mkdirSync(`${publicDir}/${element}`)
        );
        ["development", "pre", "production"].forEach((element) =>
          writeFileSync(`${publicDir}/.env.${suffiex}_${element}`, "", "utf-8")
        );
        templateVue(publicDir, templatePath, suffiex);
        templateMain(publicDir, templatePath);
        templateRouter("config", publicDir, templatePath, suffiex);
        templateRouter("index", publicDir, templatePath, suffiex);
      }
    });
  await inquirer
    .prompt([
      {
        type: "input",
        name: "projectName",
        message: "请定义分包项目名",
      },
    ])
    .then((res) => {
      let { projectName } = res;
      templateHtml(publicDir, templatePath, projectName);
    });
}

buildSubpages("src/layouts");
