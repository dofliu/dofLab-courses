#!/usr/bin/env python3
"""把一個工程數學互動單元加入課程網站。

用法：
    python3 tools/add_topic.py --slot 9 --src /path/to/page.html [--date 2026-09-30T12:00+08:00]

- slot：排程序號（2026-09-25 12:00 台灣時間為 0，每 12 小時 +1）
- 主題索引 = slot % 30，輪次 = slot // 30 + 1
- 來源檔可以是完整 HTML 文件，也可以是 Artifact 用的「無 <html>/<body> 骨架」片段；
  若沒有 <!doctype>，會自動補上骨架。
- 會在頁面加上「← 課程目錄」浮動連結，並更新 data/manifest.json 與 manifest.js。
同一個 slot 重跑會覆蓋舊檔（可重複執行）。
"""
import argparse, json, re, sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

TZ = timezone(timedelta(hours=8))
BASE = datetime(2026, 9, 25, 12, 0, tzinfo=TZ)
ROOT = Path(__file__).resolve().parent.parent
COURSE = ROOT / "courses" / "engineering-math"
DATA = COURSE / "data" / "manifest.json"
JS = COURSE / "manifest.js"

TOPICS = [
    "一階線性微分方程(I)：積分因子法",
    "一階線性微分方程(II)：可分離變數法",
    "一階線性微分方程(III)：完全微分方程",
    "二階齊次微分方程(I)：實數特徵根",
    "二階齊次微分方程(II)：重根與複數根",
    "二階非齊次微分方程(I)：未定係數法",
    "二階非齊次微分方程(II)：參數變分法",
    "高階線性微分方程：降階法與Cauchy-Euler方程",
    "拉普拉斯轉換(I)：定義與基本公式",
    "拉普拉斯轉換(II)：第一位移定理",
    "拉普拉斯轉換(III)：逆轉換與部分分式",
    "拉普拉斯轉換(IV)：應用於初值問題",
    "拉普拉斯轉換(V)：摺積定理",
    "傅立葉級數(I)：週期函數與Fourier係數",
    "傅立葉級數(II)：半範圍正弦與餘弦展開",
    "傅立葉轉換(I)：連續傅立葉轉換定義與性質",
    "傅立葉轉換(II)：頻域分析與應用",
    "矩陣代數(I)：矩陣運算與行列式",
    "矩陣代數(II)：逆矩陣與Gauss-Jordan消去法",
    "特徵值問題(I)：特徵值與特徵向量求解",
    "特徵值問題(II)：矩陣對角化",
    "向量微積分(I)：梯度、散度與旋度",
    "向量積分(I)：線積分與格林定理",
    "向量積分(II)：面積分與高斯散度定理",
    "偏微分方程(I)：熱傳導方程",
    "偏微分方程(II)：波動方程",
    "Z轉換(I)：定義、性質與反Z轉換",
    "Z轉換(II)：應用於差分方程",
    "複數分析(I)：複數基礎與複數函數",
    "複數分析(II)：解析函數與留數定理",
]

SKELETON_HEAD = (
    '<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8">'
    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
    '<style>:root{box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);'
    'padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;padding:0;'
    'font:14px system-ui,-apple-system,sans-serif}img{max-width:100%}'
    '[hidden]{display:none!important}</style></head><body>\n'
)
BACK = (
    '\n<!-- dofLab:back -->'
    '<a href="./" aria-label="回到工程數學課程目錄" style="position:fixed;z-index:9999;'
    'right:14px;bottom:calc(14px + env(safe-area-inset-bottom,0px));background:#1a237e;'
    'color:#fff;font:600 13px/1 \'Noto Sans TC\',system-ui,sans-serif;padding:10px 14px;'
    'border-radius:999px;text-decoration:none;box-shadow:0 4px 14px rgba(0,0,0,.25);'
    'border:1px solid rgba(255,255,255,.25)">← 課程目錄</a>\n'
)


def build_page(src: str) -> str:
    html = src
    html = re.sub(r"\n?<!-- dofLab:back -->.*?</a>\n?", "", html, flags=re.S)
    if not re.match(r"\s*<!doctype", html, re.I):
        html = SKELETON_HEAD + html + "\n</body></html>\n"
    if re.search(r"</body>", html, re.I):
        idx = [m.start() for m in re.finditer(r"</body>", html, re.I)][-1]
        html = html[:idx] + BACK + html[idx:]
    else:
        html += BACK
    return html


def load_manifest():
    if DATA.exists():
        return json.loads(DATA.read_text(encoding="utf-8"))
    return {"course": "工程數學互動學習", "topics_total": 30, "entries": []}


def save_manifest(m):
    m["entries"].sort(key=lambda e: e["slot"])
    m["updated"] = datetime.now(TZ).isoformat(timespec="minutes")
    DATA.parent.mkdir(parents=True, exist_ok=True)
    DATA.write_text(json.dumps(m, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    JS.write_text(
        "/* 由 tools/add_topic.py 自動產生，請勿手動編輯 */\n"
        "window.EM_MANIFEST = " + json.dumps(m, ensure_ascii=False, indent=1) + ";\n"
        "window.EM_TOPICS = " + json.dumps(TOPICS, ensure_ascii=False) + ";\n"
        "window.EM_BASE = '2026-09-25T12:00:00+08:00';\n",
        encoding="utf-8",
    )


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--slot", type=int, required=True)
    ap.add_argument("--src", required=True)
    ap.add_argument("--date", help="發布時間 ISO 格式；預設為 slot 的排程時間")
    a = ap.parse_args()

    idx, rnd = a.slot % 30, a.slot // 30 + 1
    fname = f"t{idx:02d}.html" if rnd == 1 else f"t{idx:02d}-r{rnd}.html"
    src = Path(a.src).read_text(encoding="utf-8")
    out = COURSE / fname
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(build_page(src), encoding="utf-8")

    date = a.date or (BASE + timedelta(hours=12 * a.slot)).isoformat(timespec="minutes")
    m = load_manifest()
    m["entries"] = [e for e in m["entries"] if e["slot"] != a.slot]
    m["entries"].append({
        "slot": a.slot, "index": idx, "round": rnd,
        "title": TOPICS[idx], "file": fname, "published": date,
    })
    save_manifest(m)
    print(f"OK  slot={a.slot}  topic={idx}  round={rnd}  -> courses/engineering-math/{fname}")


if __name__ == "__main__":
    sys.exit(main())
