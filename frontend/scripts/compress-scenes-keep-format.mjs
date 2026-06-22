import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const inputDir = process.argv[2] || "public/assets/scenes_raw";
const outputDir = process.argv[3] || "public/assets/scenes_compressed";

const targetBytes = 1024 * 1024; // 1MB
const minWidth = 1280;
const startWidth = 1920;

const supportedExts = new Set([".png", ".jpg", ".jpeg", ".webp"]);

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function listImages(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...await listImages(fullPath));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (supportedExts.has(ext)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

function buildOutputPath(inputPath) {
  const relativePath = path.relative(inputDir, inputPath);
  return path.join(outputDir, relativePath);
}

async function encodeByOriginalFormat(pipeline, ext, quality) {
  if (ext === ".jpg" || ext === ".jpeg") {
    return pipeline
      .jpeg({
        quality,
        mozjpeg: true,
      })
      .toBuffer();
  }

  if (ext === ".webp") {
    return pipeline
      .webp({
        quality,
        effort: 6,
      })
      .toBuffer();
  }

  if (ext === ".png") {
    return pipeline
      .png({
        compressionLevel: 9,
        adaptiveFiltering: true,

        // 关键：仍然输出 PNG，但使用调色板压缩。
        // 这不会改扩展名，也不会转 WebP。
        // 复杂背景会有轻微色彩压缩，体积会明显下降。
        palette: true,
        quality,
      })
      .toBuffer();
  }

  throw new Error(`不支持的格式：${ext}`);
}

async function compressImage(inputPath) {
  const ext = path.extname(inputPath).toLowerCase();
  const outputPath = buildOutputPath(inputPath);

  await ensureDir(path.dirname(outputPath));

  let bestBuffer = null;
  let bestQuality = 80;
  let bestWidth = startWidth;

  let currentWidth = startWidth;

  while (currentWidth >= minWidth) {
    let low = 40;
    let high = 90;
    let candidate = null;
    let candidateQuality = low;

    while (low <= high) {
      const quality = Math.floor((low + high) / 2);

      const pipeline = sharp(inputPath)
        .rotate()
        .resize({
          width: currentWidth,
          withoutEnlargement: true,
        });

      const buffer = await encodeByOriginalFormat(pipeline, ext, quality);

      if (buffer.length <= targetBytes) {
        candidate = buffer;
        candidateQuality = quality;
        low = quality + 1;
      } else {
        high = quality - 1;
      }
    }

    if (candidate) {
      bestBuffer = candidate;
      bestQuality = candidateQuality;
      bestWidth = currentWidth;
      break;
    }

    currentWidth = Math.floor(currentWidth * 0.9);
  }

  // 兜底：最低压缩方案
  if (!bestBuffer) {
    const pipeline = sharp(inputPath)
      .rotate()
      .resize({
        width: minWidth,
        withoutEnlargement: true,
      });

    bestBuffer = await encodeByOriginalFormat(pipeline, ext, 40);
    bestQuality = 40;
    bestWidth = minWidth;
  }

  await fs.writeFile(outputPath, bestBuffer);

  const originalStat = await fs.stat(inputPath);
  const originalKB = Math.round(originalStat.size / 1024);
  const outputKB = Math.round(bestBuffer.length / 1024);
  const relativePath = path.relative(inputDir, inputPath);

  console.log(
    `${relativePath}  ${originalKB}KB -> ${outputKB}KB  格式=${ext}  q=${bestQuality}  width<=${bestWidth}`
  );
}

async function main() {
  await ensureDir(outputDir);

  const files = await listImages(inputDir);

  if (files.length === 0) {
    console.log(`没有找到图片：${inputDir}`);
    return;
  }

  for (const file of files) {
    await compressImage(file);
  }

  console.log(`完成：${files.length} 张图片。`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});