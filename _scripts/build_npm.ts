import { build } from "jsr:@deno/dnt@0.41.2";
import { emptyDir } from "jsr:@std/fs@1.0.9/empty-dir";

await emptyDir("./_npm");

const version = Deno.args[0]?.replace(/^v/, "");

if (!version) {
  throw new Error("Version is required");
}

await build({
  entryPoints: [
    "./mod.ts",
    "./src/environment.ts",
    "./src/errors.ts",
    "./src/js.ts",
    "./src/loader.ts",
    "./src/tokenizer.ts",
    "./src/transformer.ts",
    "./src/url_loader.ts",
    "./plugins/auto_trim.ts",
    "./plugins/echo.ts",
    "./plugins/escape.ts",
    "./plugins/export.ts",
    "./plugins/for.ts",
    "./plugins/function.ts",
    "./plugins/if.ts",
    "./plugins/import.ts",
    "./plugins/include.ts",
    "./plugins/js.ts",
    "./plugins/layout.ts",
    "./plugins/set.ts",
    "./plugins/trim.ts",
    "./plugins/unescape.ts",
  ],
  scriptModule: false,
  outDir: "./_npm",
  shims: { deno: "dev" },
  compilerOptions: { target: "ES2022" },
  typeCheck: "both",
  package: {
    name: "ventojs",
    version,
    description: "🌬 A minimal but powerful template engine",
    license: "MIT",
    repository: "github:oscarotero/vento",
    homepage: "https://vento.js.org/",
    bugs: "https://github.com/oscarotero/vento/issues",
    devDependencies: {
      "@types/estree": "1.0.5",
    },
  },
  mappings: {
    "npm:@types/estree@1.0.6": "estree",
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", "_npm/LICENSE");
    Deno.copyFileSync("README.md", "_npm/README.md");
  },
});
