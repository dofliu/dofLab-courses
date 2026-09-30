# 材料力學互動遊戲 — 製作規格

排程每次執行只製作「下一個尚未完成」的遊戲。下一個是哪一個，以 `data/manifest.json` 為準：

```bash
python3 tools/add_mom_game.py --next     # 印出 NEXT CH{章}-G{遊戲}，或 ALL_DONE
```

## 系列

依 Hibbeler《Mechanics of Materials》章節順序，14 章 × 3 個遊戲 = 42 個，序列 CH1-G1 → CH1-G2 → CH1-G3 → CH2-G1 … → CH14-G3。

| 章 | 英文 | 中文 |
|---|---|---|
| 1 | Stress | 應力 |
| 2 | Strain | 應變 |
| 3 | Mechanical Properties | 材料力學性質 |
| 4 | Axial Load | 軸向載重 |
| 5 | Torsion | 扭轉 |
| 6 | Bending | 彎曲 |
| 7 | Transverse Shear | 橫向剪力 |
| 8 | Combined Loadings | 組合載重 |
| 9 | Stress Transformation | 應力轉換 |
| 10 | Strain Transformation | 應變轉換 |
| 11 | Design of Beams & Shafts | 梁與軸的設計 |
| 12 | Deflection of Beams & Shafts | 梁與軸的撓度 |
| 13 | Buckling of Columns | 柱的挫曲 |
| 14 | Energy Methods | 能量法 |

每章三個遊戲：

- **G1** 核心概念探索與生活化理解（副標題常用「○○探索：…」）
- **G2** 公式應用與工程案例解題（「○○計算工坊：…」）
- **G3** 綜合挑戰與設計情境（「綜合挑戰：…」）

製作前先讀同一章已完成的遊戲（`manifest.json` 裡的 title），情境與例題不要重複。

## 遊戲結構（約 60 分鐘，Tab 或步驟引導切換）

開始畫面：學生輸入姓名、學號、班級。

**Phase 1：概念理解（10 分鐘）**
- 生活化類比說明（例如：應力 → 踩氣球、扭矩 → 擰毛巾）
- SVG 動畫示意圖
- 卡通工程師角色（SVG 繪製，有對話框說明）
- 「你知道嗎？」互動問答 3 題，選對有動畫獎勵

**Phase 2：範例遊戲（15 分鐘）**
- 2 個工程情境範例，帶動畫的步驟解題過程
- 學生可點選每一步查看說明
- 互動式數值調整（slider 調整參數，即時顯示結果變化）

**Phase 3：練習關卡（20 分鐘）**
- 4 道練習題（計算題 + 選擇題混合）
- 即時回饋：正確顯示綠色 ✓ + 鼓勵訊息；錯誤顯示紅色 + 提示
- 每題有「查看解題步驟」按鈕
- 得分計算與進度條

**Phase 4：測試挑戰（15 分鐘）**
- 再次確認顯示姓名、學號、班級
- 隨機種子 = parseInt(學號後 4 碼)，沒有數字時將學號字串雜湊成數字
- 用種子產生題目數值（合理工程範圍內 ±20%）與選項排列順序
- 5 道正式測試題（計算 + 判斷），全部答完才能交卷看成績
- 倒數計時 15 分鐘，時間到自動交卷

**成績報告**
- 「列印 / 存成 PDF」按鈕（`window.print()`，GitHub Pages 上可正常列印），另附「複製成績文字」按鈕
- 內容：姓名、班級、學號、日期時間、遊戲名稱（章節 + 遊戲號）、Phase 3 練習得分、Phase 4 測試得分（每題對錯與正確答案）、總分與等第（A/B/C/D）、工程師鼓勵語

## 視覺設計

- 主色：深藍 `#1a3a5c`、橙色 `#e8640a`、淺灰 `#f5f6fa`
- 精美的工程圖 SVG（螺栓、梁、柱、力箭頭等）
- 進度條橫跨頂部；卡通工程師在每個 Phase 開場引導
- CSS transition 動畫（淡入、滑動切換），尊重 `prefers-reduced-motion`
- 響應式（手機 400px 寬也能用，頁面不可橫向捲動）
- 列印樣式 `@media print`（只印成績報告）
- 最下方署名：國立勤益科技大學 智慧自動化工程系 劉瑞弘老師研究室

## 技術規格

- 單一 HTML 檔，內嵌所有 CSS 與 JavaScript；Vanilla JS，不用外部函式庫（Google Fonts 可以）
- 繁體中文介面
- 材料力學公式必須正確，使用 SI 單位（Pa、N、m、MPa、GPa）；範例與解題步驟的數字由程式計算，不要手寫
- `<title>` 格式：`[MOM-CH{章}-G{遊戲}] {英文章名} - {中文副標題}`，例：`[MOM-CH1-G1] Stress - 應力探索：橋樑承受的力量`
- 發布前用 Playwright（Chromium 已預裝）跑一次：輸入學生資料 → 各 Phase 點選 → 交卷 → 確認成績報告出現、沒有 console error

## 加入網站

```bash
python3 tools/add_mom_game.py --ch <章> --game <遊戲> --src <遊戲 HTML 檔>
git add -A && git commit -m "feat(mom): 新增 MOM-CH<章>-G<遊戲> <中文副標題>" && git push origin main
```

網址：`https://dofliu.github.io/dofLab-courses/courses/mechanics-of-materials/chNN-gK.html`
