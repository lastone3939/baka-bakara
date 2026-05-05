import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";

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
  await mkdir("dist/assets/characters", { recursive: true });
  await mkdir("dist/assets/icons", { recursive: true });
  await Promise.all(publicFiles.map((file) => cp(file, `dist/${file}`)));
  const characterFiles = await readdir("assets/characters");
  await Promise.all(
    characterFiles
      .filter((file) => file.endsWith(".png"))
      .map((file) => cp(`assets/characters/${file}`, `dist/assets/characters/${file}`))
  );
  await cp("assets/icons", "dist/assets/icons", { recursive: true });
  await writeFile("dist/public-config.js", output);
  console.log("dist generated");
}
