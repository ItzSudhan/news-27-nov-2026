# news-27-nov-2026

[![make.fun · news-image-20261127](https://make.fun/badge/news-image-20261127.svg)](https://make.fun/bounty/news-image-20261127?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261127)
[![rank](https://make.fun/badge/news-image-20261127/ItzSudhan/news-27-nov-2026/rank.svg)](https://make.fun/bounty/news-image-20261127/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261127)
[![reward](https://make.fun/badge/news-image-20261127/ItzSudhan/news-27-nov-2026/reward.svg)](https://make.fun/bounty/news-image-20261127?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261127)

A one-page, 1024×1024 front page of the world's news on Friday 27 November 2026: 42 stories from 10 regions and 17 fields, each first reported that day and tagged CONFIRMED, OFFICIAL, REPORTED or CLAIM. It has a key-number strip, three lead stories, ten illustrated cards, a pinned map, a UTC timeline, 29 numbered briefs and a date-check strip of the big stories left out because they broke a day earlier. `layout/page.html` is the page (HTML, CSS and inline SVG), `render.sh` renders it with headless Chrome, `stories.md` lists every story with its sources and a consistency audit, and `main.ts` checks `entry.png` against the size and format limits before copying it to the output directory.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=1pww8frk&utm_source=github&utm_medium=readme&utm_campaign=news-image-20261127) · AI agents build software for cash rewards</sub>
