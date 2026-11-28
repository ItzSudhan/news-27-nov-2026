// Entry for make.fun "Sum up 27 November's world news in one image" (news-image-20261127).
// The picture is entry.png beside this file (rendered from layout/page.html by render.sh).
// This program checks it against the gate's limits and writes the same bytes to the output directory.
// Node 22, standard library only.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_BYTES = 1_048_576;
const MAX_SIDE = 1024;

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, 'entry.png');

function fail(message: string): never {
  process.stderr.write(`entry check failed: ${message}\n`);
  process.exit(1);
}

type Info = { format: 'PNG' | 'JPEG'; width: number; height: number };

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

function pngInfo(buf: Buffer): Info {
  // The first chunk must be IHDR: length(4) "IHDR"(4) width(4) height(4).
  if (buf.length < 24 || buf.toString('latin1', 12, 16) !== 'IHDR') fail('PNG without an IHDR chunk first');
  return { format: 'PNG', width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function jpegInfo(buf: Buffer): Info {
  // Walk the marker segments after SOI until a baseline (SOF0) or progressive (SOF2) frame header.
  let i = 2;
  while (i + 4 <= buf.length) {
    if (buf[i] !== 0xff) fail(`JPEG marker expected at byte ${i}`);
    const marker = buf[i + 1];
    if (marker === 0xff) { i += 1; continue; }            // fill byte
    if (marker === 0xd9 || marker === 0xda) break;        // EOI or start of scan: no frame header found
    const length = buf.readUInt16BE(i + 2);
    if (marker === 0xc0 || marker === 0xc2) {
      if (i + 9 > buf.length) fail('truncated JPEG frame header');
      return { format: 'JPEG', height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + length;
  }
  fail('JPEG without an SOF0/SOF2 frame header');
}

let bytes: Buffer;
try {
  bytes = readFileSync(source);
} catch (err) {
  fail(`cannot read ${source}: ${(err as Error).message}`);
}

if (bytes.length > MAX_BYTES) fail(`file is ${bytes.length} bytes, over the ${MAX_BYTES}-byte limit`);

let info: Info;
if (PNG_SIGNATURE.every((b, k) => bytes[k] === b)) info = pngInfo(bytes);
else if (bytes[0] === 0xff && bytes[1] === 0xd8) info = jpegInfo(bytes);
else fail('not a PNG or JPEG (unrecognised first bytes)');

if (info.width < 1 || info.height < 1) fail(`bad dimensions ${info.width}x${info.height}`);
if (info.width > MAX_SIDE || info.height > MAX_SIDE) fail(`image is ${info.width}x${info.height}, over ${MAX_SIDE}x${MAX_SIDE}`);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'entry.png'), bytes);

console.log(`entry.png: ${info.format} ${info.width}x${info.height}, ${bytes.length} bytes -> ${join(outDir, 'entry.png')}`);
