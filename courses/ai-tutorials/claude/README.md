# Claude AI 應用動畫課程

中文／English 雙語的 Claude AI 教學動畫。每集是一支獨立的 HTML（canvas 分鏡播放器），由排程工作每次製作一個單元。

- 待製作清單與規則：`data/curriculum.json`（`rules`、每個單元的 `scenes` 與 `cases`）
- 進度：`data/PROGRESS.md`
- 引擎：`_studio/`（源自 energy-animation-studio，已改為 zh/en；kit-claude.js 為本課程專用繪圖函式）
- 目錄資料：修改 `data/catalog.json` 或 `data/curriculum.json` 後執行 `python3 tools/build_claude_course.py`

## 測驗關卡與認證準備

每隔數集有一個獨立的測驗單元（`type: quiz`，8 題上下，80 分通過），最後的「認證準備」系列有 3 份模擬認證。測驗為課程自編練習，並非 Anthropic 官方認證考試。

- 題庫：`data/quizzes/<id>.json`（zh／en 雙語，單選，附解析與對應單元）
- 建置：`python3 _studio/scripts/build_quiz.py data/quizzes/<id>.json --out <series>/quizN.html`（樣板 `_studio/engine/quiz_template.html`）
- 互動頁功能：隨機題序與選項、即時對錯與解析、各主題答對率、答錯題目複習，最佳成績存在瀏覽器（localStorage），課程目錄會顯示
- 製作規則見 `data/curriculum.json` 的 `rules`
