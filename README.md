# dofLab Courses

國立勤益科技大學 智慧自動化工程系 劉瑞弘 研究室的互動課程網站，以 GitHub Pages 發布。

## 結構

```
index.html                       課程入口首頁
assets/site.css                  首頁與課程目錄共用樣式
courses/engineering-math/
  index.html                     工程數學單元目錄（讀取 manifest.js）
  tNN.html / tNN-rK.html         各單元互動頁（NN = 主題 0–29，rK = 第 K 輪）
  data/manifest.json             已上線單元清單（唯一資料來源）
  manifest.js                    由 manifest.json 自動產生，供頁面讀取
tools/add_topic.py               新增／更新單元的工具
courses/ai-tutorials/
  index.html                     「AI 使用教學」主題頁
  claude/                        Claude AI 應用動畫課程（中文／English）
    index.html                   課程目錄（讀取 course.js）
    course.js                    由 tools/build_claude_course.py 產生
    <series>/overview.html, epNN.html   各集動畫
    src/<單元id>.js, .i18n.js    各集原始碼
    data/curriculum.json         全部單元與狀態（排程依此製作下一集）
    data/catalog.json            已上線集數
    data/PROGRESS.md             進度與執行紀錄
    _studio/                     動畫引擎（build.py、qa.py、kit-claude.js）
tools/build_claude_course.py     重建 Claude 課程目錄資料
courses/mechanics-of-materials/
  index.html                     材料力學遊戲目錄（讀取 manifest.js）
  chNN-gK.html                   各遊戲（NN = 章 1–14，K = 遊戲 1–3）
  data/manifest.json             已上線遊戲清單（唯一資料來源）
  data/SPEC.md                   遊戲製作規格（排程依此製作下一個遊戲）
  manifest.js                    由 manifest.json 自動產生
tools/add_mom_game.py            新增／更新材料力學遊戲的工具
```

## 新增一個工程數學單元

```bash
python3 tools/add_topic.py --slot <排程序號> --src <單元 HTML 檔>
```

排程序號以 2026-09-25 12:00（台灣時間）為 0，每 12 小時 +1；主題 = slot % 30，輪次 = slot // 30 + 1。
來源檔可以是完整 HTML，也可以是不含 `<html>/<body>` 骨架的片段，工具會自動補齊，並加上「← 課程目錄」連結。

## 新增一個材料力學遊戲

```bash
python3 tools/add_mom_game.py --next                                   # 查下一個要做的遊戲
python3 tools/add_mom_game.py --ch 5 --game 3 --src <遊戲 HTML 檔>      # 加入網站並更新清單
```

遊戲規格見 `courses/mechanics-of-materials/data/SPEC.md`。來源檔 `<title>` 需為 `[MOM-CH{章}-G{遊戲}] {英文章名} - {中文副標題}`。

## 新增其他課程

在 `courses/<課程代號>/` 建立新目錄，並在根目錄 `index.html` 的「課程」區塊加一張卡片。

## 新增一集 Claude AI 動畫

```bash
cd courses/ai-tutorials/claude
python3 _studio/scripts/build.py src/<單元id>.js --out <series>/epNN.html
python3 _studio/scripts/qa.py <series>/epNN.html --outdir /tmp/qa --langs zh,en
cd ../../.. && python3 tools/build_claude_course.py
```

## GitHub Pages 設定

Settings → Pages → Build and deployment → Source 選 **Deploy from a branch**，Branch 選 `main`、資料夾 `/ (root)`。
