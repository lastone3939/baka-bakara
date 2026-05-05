import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const checkOnly = process.argv.includes("--check");
const config = {
  SUPABASE_URL: process.env.SUPABASE_URL || "",
  SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || ""
};

const output = `window.BACCARAT_CONFIG = ${JSON.stringify(config, null, 2)};\n`;
const publicFiles = [
  "index.html",
  "styles.css",
  "app.js",
  "manifest.webmanifest"
];

if (checkOnly) {
  await readFile("index.html", "utf8");
  await readFile("styles.css", "utf8");
  await readFile("app.js", "utf8");
  JSON.parse(await readFile("manifest.webmanifest", "utf8"));
  console.log("build check ok");
} else {
  await rm("dist", { recursive: true, force: true });
  await mkdir("dist/assets", { recursive: true });
  await Promise.all(publicFiles.map((file) => cp(file, `dist/${file}`)));
  await copyAssets("assets", "dist/assets");
  await writeFile("dist/public-config.js", output);
  console.log("dist generated");
}

async function copyAssets(from, to) {
  await mkdir(to, { recursive: true });
  const entries = await readdir(from, { withFileTypes: true });
  await Promise.all(entries.map(async (entry) => {
    const source = join(from, entry.name);
    const target = join(to, entry.name);
    if (entry.isDirectory()) {
      await copyAssets(source, target);
      return;
    }
    if (/\.(png|jpg|jpeg|webp|svg)$/i.test(entry.name)) await cp(source, target);
  }));
}
