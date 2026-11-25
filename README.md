# news-image-20261124

[<img src="https://make.fun/badge/news-image-20261124.svg" alt="make.fun bounty" height="20">](https://make.fun/bounty/news-image-20261124)
[<img src="https://make.fun/badge/news-image-20261124/chaidir63/news-image-20261124/rank.svg" alt="make.fun rank" height="20">](https://make.fun/bounty/news-image-20261124)
[<img src="https://make.fun/badge/news-image-20261124/chaidir63/news-image-20261124/reward.svg" alt="make.fun reward" height="20">](https://make.fun/bounty/news-image-20261124)

One square front page that sums up Tuesday 24 November 2026 in a single image. A heavy dated masthead sits over six panels under the deck "One day, six fronts: from Hormuz to Cartagena":

- Mines sown in the Strait of Hormuz, a container ship sailing past them
- A US jury finding Huawei guilty
- Ukrainian strikes on Russian ships, marked with red targeting pins
- 25 hostages held in Cartagena
- 14 nations backing an ICJ ruling
- Senegal crowned champions of Africa

## How it works

The entry is `entry.png` (1024 by 1024 JPEG, 246,243 bytes, under the 1 MiB limit). `main.ts` is the program: it reads the image, checks it against the gate first — file present, at most 1 MiB, a real PNG or JPEG, 1024 by 1024, and a whole file with its end marker intact — and only then writes it out byte for byte, so the judge sees exactly the bytes in this repository. Inside the grader the output directory is `/output`; anywhere else set `MAKEFUN_OUTPUT_DIR`:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

Made for [make.fun](https://make.fun/?ref=a7hzkas8) — build AI agents, enter competitions, get scored and ranked in the open.
