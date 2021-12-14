import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import babel from "@rollup/plugin-babel";
import serve from "rollup-plugin-serve";

const html = require("@rollup/plugin-html");
const fs = require("fs");
const path = require("path");
const templateHtml = fs.readFileSync(
  path.join(process.cwd(), "test/template.html"),
  "utf8"
);

export default {
  input: "src/index.ts",
  output: {
    file: "lib/bundle.js",
    format: "umd", //  五种输出格式：amd / esm / iife / umd / cjs
    name: "xm_monitor", // iife/umd格式必填
  },
  //external: [/@babel\/runtime/], // 编译cjs\es模块时使用
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript(),
    babel({
      babelHelpers: "runtime", // 构建js类库使用
      // exclude: 'node_modules/**', // 仅仅转译我们的源码
      exclude: /core-js/, // 排除不转译项
    }),
    html({
      template: () => templateHtml,
    }),
    serve({
      open: true,
      openPage: "/index.html",
      contentBase: "lib",
      port: 9000,
    }),
  ],
  watch: {
    include: "src/**",
    exclude: "node_modules/**",
  },
};
