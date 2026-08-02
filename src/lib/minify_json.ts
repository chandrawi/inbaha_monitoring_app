import { Glob } from "bun";
import { gzipSync, brotliCompressSync, constants } from "node:zlib";

const ROOT = ".output/public";
const glob = new Glob("**/*.json");
let processed = 0;

for await (const file of glob.scan(ROOT)) {
  const path = `${ROOT}/${file}`;

  try {
    // Parse & minify JSON
    const json = await Bun.file(path).json();
    const minified = JSON.stringify(json);

    // Overwrite file JSON with minified version
    await Bun.write(path, minified);

    // Only compress file if compressed file result is shorter
    const size = Buffer.byteLength(minified, "utf8");

    const gzip = gzipSync(minified, { level: 9 });
    if (gzip.length < size) {
      await Bun.write(`${path}.gz`, gzip);
    }
    
    const br = brotliCompressSync(minified, {
      params: {
        [constants.BROTLI_PARAM_QUALITY]: 11,
      },
    });
    if (br.length < size) {
      await Bun.write(`${path}.br`, br);
    }

    processed++;
    console.log(`✓ ${file}`);
  } catch (err) {
    console.error(`✗ ${file}`);
    console.error(err);
  }
}

console.log(`\nProcessed ${processed} JSON file(s).`);
