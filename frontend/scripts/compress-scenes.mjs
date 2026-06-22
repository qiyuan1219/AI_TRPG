import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const inputDir = process.argv[2] || "public/assets/scenes_raw";
const outputDir = process.argv[3] || "public/assets/scenes";
const targetBytes = 1024 * 1024; // 目标：1MB 以下

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

async function compressImage(inputPath) {
  const relativePath = path.relative(inputDir, inputPath);
  const parsed = path.parse(relativePath);
  const outputPath = path.join(outputDir, parsed.dir, `${parsed.name}.webp`);

  await ensureDir(path.dirname(outputPath));

  let maxWidth = 1920;
  let bestBuffer = null;
  let bestQuality = 80;

  while (maxWidth >= 1280) {
    let low = 45;
    let high = 90;
    let candidate = null;
    let candidateQuality = low;

    while (low <= high) {
      const quality = Math.floor((low + high) / 2);

      const buffer = await sharp(inputPath)
        .rotate()
        .resize({
          width: maxWidth,
          withoutEnlargement: true,
        })
        .webp({
          quality,
          effort: 6,
        })
        .toBuffer();

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
      break;
    }

    maxWidth = Math.floor(maxWidth * 0.9);
  }

  if (!bestBuffer) {
    bestBuffer = await sharp(inputPath)
      .rotate()
      .resize({
        width: 1280,
        withoutEnlargement: true,
      })
      .webp({
        quality: 45,
        effort: 6,
      })
      .toBuffer();

    bestQuality = 45;
    maxWidth = 1280;
  }

  await fs.writeFile(outputPath, bestBuffer);

  const originalStat = await fs.stat(inputPath);
  const originalMB = (originalStat.size / 1024 / 1024).toFixed(2);
  const outputKB = (bestBuffer.length / 1024).toFixed(0);

  console.log(
    `${relativePath}  ${originalMB}MB -> ${outputKB}KB  q=${bestQuality} width<=${maxWidth}`
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

  console.log(`完成：${files.length} 张图片已输出到 ${outputDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});