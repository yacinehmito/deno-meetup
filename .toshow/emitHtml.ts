// @ts-nocheck

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
