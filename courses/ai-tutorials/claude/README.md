# Claude AI 應用動畫課程

中文／English 雙語的 Claude AI 教學動畫。每集是一支獨立的 HTML（canvas 分鏡播放器），由排程工作每次製作一個單元。

- 待製作清單與規則：`data/curriculum.json`（`rules`、每個單元的 `scenes` 與 `cases`）
- 進度：`data/PROGRESS.md`
- 引擎：`_studio/`（源自 energy-animation-studio，已改為 zh/en；kit-claude.js 為本課程專用繪圖函式）
- 目錄資料：修改 `data/catalog.json` 或 `data/curriculum.json` 後執行 `python3 tools/build_claude_course.py`
