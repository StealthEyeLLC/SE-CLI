import { readFile, writeFile } from "node:fs/promises";

const target = new URL("../src/index.ts", import.meta.url);
let source = await readFile(target, "utf8");

source = source.replace("item === prefix || item.startsWith(`${prefix} `)", "item === prefix");

await writeFile(target, source, "utf8");
