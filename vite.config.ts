import { resolve } from "path";
import { svgModule } from "./config/svgModule";
import { subModule, getPublicDir } from "./config/subModule";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { createStyleImportPlugin, VantResolve } from "vite-plugin-style-import";
import Vitecomponents, { AntDesignVueResolver } from "vite-plugin-components";

export default defineConfig(({ mode }) => {

  return {
    plugins: [
      vue(),
      vueJsx(),
      Vitecomponents({
        customComponentResolvers: [
          AntDesignVueResolver({
            importLess: true,
            importStyle: "less",
          }),
        ],
      }),
      // 2.0.0 之后版本按需引入
      createStyleImportPlugin({
        libs: [
          {
            libraryName: "ant-design-vue",
            esModule: true,
            resolveStyle: (name) => {
              return resolve(
                __dirname,
                `node_modules/ant-design-vue/es/${name}/style/index`
              );
            },
          },
        ],
        resolves: [VantResolve()],
      }),
      svgModule("./src/assets/svg/"),
    ],
    root: subModule('root', 'src/layouts', mode, __dirname),
    publicDir: getPublicDir(mode, __dirname),
    base: "./",
    css: {
      //* css 模块化
      modules: {
        generateScopedName: "[name]_[local]__[hash:base64:5]",
        hashPrefix: "prefix",
      },
      
      // 配置主题
      preprocessorOptions: {
        less: Object.assign({}, subModule('theme', 'src/layouts', mode, __dirname), { javascriptEnabled: true })
      },
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
      extensions: [".js", ".json", ".ts", ".tsx", ".jsx"],
    },
    // 代理服务器
    server: {
      host: "localhost",
      port: 8000,
      open: true, // 热启动
      proxy: {
        "/fcapi": {
          target: loadEnv(mode, process.cwd()).VITE_RES_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/fcapi/, ""),
        },
        "/api": {
          target: "http://192.168.110.60:8072",
          // target: "https://op.cn88555.com/api",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
      fs: { strict: false },
    },
    build: subModule('build', 'src/layouts', mode, __dirname),
  };
});
