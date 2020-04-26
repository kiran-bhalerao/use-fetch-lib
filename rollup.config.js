import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";

export default [
  {
    input: "index.ts",
    external: Object.keys(pkg.dependencies || {}).concat(
      Object.keys(pkg.peerDependencies || {})
    ),
    plugins: [
      typescript({
        typescript: require("typescript"),
      }),
      terser(),
    ],
    output: [{ file: pkg.main, format: "cjs" }],
  },
];
