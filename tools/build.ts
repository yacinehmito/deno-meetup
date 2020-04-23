import { ensureFile } from 'https://deno.land/std/fs/mod.ts';

const encoder = new TextEncoder();

const [diagnostics, emitMap] = await Deno.compile('src/js/script.ts', undefined, {
  lib: ['dom', 'esnext'],
  target: 'esnext',
  sourceMap: false,
  inlineSourceMap: true,
  outDir: 'www/js'
});

if (diagnostics) {
  console.error(diagnostics);
} else {
  console.log("emitted");
  console.log(emitMap);
  await Promise.all(Object.entries(emitMap).map(async ([filePath, content]) => {
    await ensureFile(filePath);
    await Deno.writeFile(filePath, encoder.encode(content));
  }))
}
