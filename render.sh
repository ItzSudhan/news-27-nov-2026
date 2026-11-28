#!/bin/sh
# Render layout/page.html (1024x1024) into entry.png with headless Chrome.
# If the PNG is over 1 MiB, re-encode it as a quality-90 JPEG but keep the name entry.png.
set -eu

ROOT="$(cd "$(dirname "$0")" && pwd)"
PAGE="$ROOT/layout/page.html"
OUT="$ROOT/entry.png"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
LIMIT=1048576

"$CHROME" --headless=new --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=1024,1024 --virtual-time-budget=2000 \
  --screenshot="$OUT" "file://$PAGE" >/dev/null 2>&1

SIZE=$(stat -f %z "$OUT")
if [ "$SIZE" -gt "$LIMIT" ]; then
  TMP="$ROOT/.entry-tmp.jpg"
  sips -s format jpeg -s formatOptions 90 "$OUT" --out "$TMP" >/dev/null
  mv "$TMP" "$OUT"
  SIZE=$(stat -f %z "$OUT")
  echo "converted to JPEG: $SIZE bytes"
fi

echo "entry.png: $SIZE bytes"
sips -g pixelWidth -g pixelHeight "$OUT" | tail -2
