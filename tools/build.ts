import { ensureFile } from "https://deno.land/std/fs/mod.ts";
import { dirname, basename, extname } from "https://deno.land/std/path/mod.ts";

const tsScriptEntryPoint = "script.ts";
const htmlEntryPoint = "index.html";
const wwwDirectory = "www";

const decoder = new TextDecoder("utf-8");
const encoder = new TextEncoder();

const tsConfig = JSON.parse(
  decoder.decode(await Deno.readFile(`${Deno.cwd()}/tsconfig.json`))
);

const [diagnostics, emitMap] = await Deno.compile(
  `${Deno.cwd()}/ts/${tsScriptEntryPoint}`,
  undefined,
  tsConfig.compilerOptions
);

if (diagnostics) {
  console.error(diagnostics);
} else {
  await emitHtml(emitMap);
  await emitJs(emitMap);
}

async function emitHtml(emitMap: Record<string, string>): Promise<void> {
  const outputFilePaths = Object.keys(emitMap);
  const importEntries = outputFilePaths
    .filter((out) => extname(out) === ".js")
    .flatMap((out) => {
      const absoluteFilePath = removeRootDir(out);
      return [
        [replaceExtension(absoluteFilePath, ".ts"), absoluteFilePath],
        [replaceExtension(absoluteFilePath, ".tsx"), absoluteFilePath],
      ];
    });
  const importMap = JSON.stringify(
    { imports: Object.fromEntries(importEntries) },
    null,
    2
  );
  const htmlTemplate = decoder.decode(await Deno.readFile("./index.html"));
  const htmlOutput = htmlTemplate.replace(
    "<!-- ##IMPORTMAP## -->",
    `<script type="importmap">\n${importMap}\n</script>`
  );
  const htmlOutputFilePath = "./www/index.html";
  await ensureFile(htmlOutputFilePath);
  await Deno.writeFile(htmlOutputFilePath, encoder.encode(htmlOutput));
}

function removeRootDir(input: string): string {
  // FIXME: hardcoded
  return input.slice(5);
}

function replaceExtension(input: string, ext: string): string {
  return `${dirname(input)}/${basename(input, extname(input))}${ext}`;
}

async function emitJs(emitMap: Record<string, string>): Promise<void> {
  await Promise.all(
    Object.entries(emitMap).map(async ([filePath, content]) => {
      await ensureFile(filePath);
      await Deno.writeFile(filePath, encoder.encode(content));
    })
  );
}
