// news-image-20261124 entry (Node 22, standard library only, no network).
//
// The entry is the image file entry.png next to this program. Before it is
// published the program checks it against the competition gate: the file must
// exist, be at most 1 MiB, be a whole PNG or JPEG, and measure 1024 by 1024
// pixels. When every check passes the file is written out byte for byte, so
// the judge sees exactly the bytes held in the repository.
//
// In the grader the output directory is /output. Anywhere else, point
// MAKEFUN_OUTPUT_DIR at the directory you want, for example:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_BYTES = 1024 * 1024;
const EXPECTED_WIDTH = 1024;
const EXPECTED_HEIGHT = 1024;

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const JPEG_SIGNATURE = Buffer.from([0xff, 0xd8]);

function fail(message: string): never {
  console.error(`entry rejected: ${message}`);
  process.exit(1);
}

function pngSize(image: Buffer): { width: number; height: number } | null {
  if (!image.subarray(0, 8).equals(PNG_SIGNATURE)) return null;
  if (image.length < 24 || image.toString('ascii', 12, 16) !== 'IHDR') return null;
  return { width: image.readUInt32BE(16), height: image.readUInt32BE(20) };
}

function jpegSize(image: Buffer): { width: number; height: number } | null {
  if (!image.subarray(0, 2).equals(JPEG_SIGNATURE)) return null;
  let offset = 2;
  while (offset + 9 < image.length) {
    if (image[offset] !== 0xff) return null;
    const marker = image[offset + 1];
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9)) {
      offset += 2;
      continue;
    }
    const length = image.readUInt16BE(offset + 2);
    if (length < 2 || offset + 2 + length > image.length) return null;
    if (marker === 0xc0 || marker === 0xc2) {
      return { height: image.readUInt16BE(offset + 5), width: image.readUInt16BE(offset + 7) };
    }
    offset += 2 + length;
  }
  return null;
}

function describe(image: Buffer): { kind: string; width: number; height: number } {
  const png = pngSize(image);
  if (png) return { kind: 'PNG', ...png };
  const jpeg = jpegSize(image);
  if (jpeg) return { kind: 'JPEG', ...jpeg };
  fail('entry.png is neither a PNG nor a JPEG (checked the first bytes)');
}

function checkWhole(image: Buffer, kind: string): void {
  if (kind === 'JPEG') {
    if (!image.subarray(image.length - 2).equals(Buffer.from([0xff, 0xd9]))) {
      fail('entry.png is a truncated JPEG: no end-of-image marker at the end');
    }
    return;
  }
  const tail = image.subarray(image.length - 12);
  if (tail.length < 12 || tail.readUInt32BE(0) !== 0 || tail.toString('ascii', 4, 8) !== 'IEND') {
    fail('entry.png is a truncated PNG: no IEND chunk at the end');
  }
}

const source = join(dirname(fileURLToPath(import.meta.url)), 'entry.png');
if (!existsSync(source)) fail('entry.png is missing next to main.ts');

const size = statSync(source).size;
if (size === 0) fail('entry.png is empty');
if (size > MAX_BYTES) fail(`entry.png is ${size} bytes, over the 1 MiB limit`);

const image = readFileSync(source);
const info = describe(image);
if (info.width !== EXPECTED_WIDTH || info.height !== EXPECTED_HEIGHT) {
  fail(`entry.png is ${info.width}x${info.height}, the gate needs 1024x1024`);
}
checkWhole(image, info.kind);

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outputDir, { recursive: true });
const target = join(outputDir, 'entry.png');
writeFileSync(target, image);
console.log(`wrote ${target}: ${info.kind} ${info.width}x${info.height}, ${size} bytes, copied byte for byte`);
