import sharp from "sharp";
import { readdir, mkdir } from "fs/promises";
import { join, basename, extname } from "path";

const ASSETS = join(import.meta.dirname, "../../assets");
const OUT = join(import.meta.dirname, "../public/images");

const FRESCOES_SRC = join(ASSETS, "background-images");
const SEEDS_SRC = join(ASSETS, "icon-images");
const FRESCOES_OUT = join(OUT, "frescoes");
const SEEDS_OUT = join(OUT, "seeds");

await mkdir(FRESCOES_OUT, { recursive: true });
await mkdir(SEEDS_OUT, { recursive: true });

const frescoFiles = (await readdir(FRESCOES_SRC)).filter((f) =>
  f.endsWith(".png")
);
for (const file of frescoFiles) {
  const name = basename(file, extname(file));
  const src = join(FRESCOES_SRC, file);
  await sharp(src).resize(2000).webp({ quality: 80 }).toFile(join(FRESCOES_OUT, `${name}.webp`));
  await sharp(src).resize(1200).webp({ quality: 75 }).toFile(join(FRESCOES_OUT, `${name}-1200.webp`));
  await sharp(src).resize(800).webp({ quality: 70 }).toFile(join(FRESCOES_OUT, `${name}-800.webp`));
  console.log(`  fresco: ${name}`);
}

const seedFiles = (await readdir(SEEDS_SRC)).filter((f) => f.endsWith(".png"));
for (const file of seedFiles) {
  const name = basename(file, extname(file));
  const src = join(SEEDS_SRC, file);
  await sharp(src).resize(400).webp({ quality: 85 }).toFile(join(SEEDS_OUT, `${name}.webp`));
  await sharp(src).resize(200).webp({ quality: 80 }).toFile(join(SEEDS_OUT, `${name}-200.webp`));
  console.log(`  seed: ${name}`);
}

console.log("Done.");
