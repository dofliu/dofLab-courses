#!/usr/bin/env python3
"""把一個材料力學互動遊戲加入課程網站。

用法：
    python3 tools/add_mom_game.py --ch 5 --game 2 --src /path/to/page.html [--date 2026-09-30T05:00+08:00]
    python3 tools/add_mom_game.py --next        # 印出下一個要製作的遊戲（CH 與 G）

- 共 14 章 × 3 遊戲 = 42 個，依 Hibbeler《Mechanics of Materials》章節順序。
- 輸出檔名：courses/mechanics-of-materials/chNN-gK.html
- 遊戲標題取自來源檔的 <title>（格式 [MOM-CH{章}-G{遊戲}] {英文章名} - {中文副標題}）。
- 來源檔可以是完整 HTML，也可以是 Artifact 用的無骨架片段；沒有 <!doctype> 會自動補上。
- 會加上「← 課程目錄」浮動連結（列印時隱藏），並更新 data/manifest.json 與 manifest.js。
同一個 CH/G 重跑會覆蓋舊檔（可重複執行）。
"""
import argparse, json, re, sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

TZ = timezone(timedelta(hours=8))
ROOT = Path(__file__).resolve().parent.parent
COURSE = ROOT / "courses" / "mechanics-of-materials"
DATA = COURSE / "data" / "manifest.json"
JS = COURSE / "manifest.js"

CHAPTERS = [
    ["Stress", "應力"],
    ["Strain", "應變"],
    ["Mechanical Properties", "材料力學性質"],
    ["Axial Load", "軸向載重"],
    ["Torsion", "扭轉"],
    ["Bending", "彎曲"],
    ["Transverse Shear", "橫向剪力"],
    ["Combined Loadings", "組合載重"],
    ["Stress Transformation", "應力轉換"],
    ["Strain Transformation", "應變轉換"],
    ["Design of Beams & Shafts", "梁與軸的設計"],
    ["Deflection of Beams & Shafts", "梁與軸的撓度"],
    ["Buckling of Columns", "柱的挫曲"],
    ["Energy Methods", "能量法"],
]
GAMES = ["核心概念探索", "公式應用與工程案例", "綜合挑戰與設計情境"]

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
    '<style>@media print{.doflab-back{display:none!important}}</style>'
    '<a class="doflab-back" href="./" aria-label="回到材料力學課程目錄" style="position:fixed;z-index:9999;'
    'left:14px;bottom:calc(14px + env(safe-area-inset-bottom,0px));background:#1a3a5c;'
    'color:#fff;font:600 13px/1 \'Noto Sans TC\',system-ui,sans-serif;padding:10px 14px;'
    'border-radius:999px;text-decoration:none;box-shadow:0 4px 14px rgba(0,0,0,.25);'
    'border:1px solid rgba(255,255,255,.25)">← 課程目錄</a>\n'
)


def build_page(src: str) -> str:
    html = re.sub(r"\n?<!-- dofLab:back -->.*?</a>\n?", "", src, flags=re.S)
    if not re.match(r"\s*<!doctype", html, re.I):
        html = SKELETON_HEAD + html + "\n</body></html>\n"
    ends = [m.start() for m in re.finditer(r"</body>", html, re.I)]
    return html[:ends[-1]] + BACK + html[ends[-1]:] if ends else html + BACK


def load_manifest():
    if DATA.exists():
        return json.loads(DATA.read_text(encoding="utf-8"))
    return {"course": "材料力學互動遊戲", "total": 42, "entries": []}


def save_manifest(m):
    m["entries"].sort(key=lambda e: (e["ch"], e["game"]))
    m["updated"] = datetime.now(TZ).isoformat(timespec="minutes")
    DATA.parent.mkdir(parents=True, exist_ok=True)
    DATA.write_text(json.dumps(m, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    JS.write_text(
        "/* 由 tools/add_mom_game.py 自動產生，請勿手動編輯 */\n"
        "window.MOM_MANIFEST = " + json.dumps(m, ensure_ascii=False, indent=1) + ";\n"
        "window.MOM_CHAPTERS = " + json.dumps(CHAPTERS, ensure_ascii=False) + ";\n"
        "window.MOM_GAMES = " + json.dumps(GAMES, ensure_ascii=False) + ";\n",
        encoding="utf-8",
    )


def next_game(m):
    done = {(e["ch"], e["game"]) for e in m["entries"]}
    for ch in range(1, 15):
        for g in range(1, 4):
            if (ch, g) not in done:
                return ch, g
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ch", type=int)
    ap.add_argument("--game", type=int)
    ap.add_argument("--src")
    ap.add_argument("--date", help="發布時間 ISO 格式；預設為現在（台灣時間）")
    ap.add_argument("--next", action="store_true", help="只印出下一個要製作的遊戲")
    a = ap.parse_args()

    m = load_manifest()
    if a.next:
        n = next_game(m)
        if n is None:
            print("ALL_DONE")
        else:
            ch, g = n
            print(f"NEXT CH{ch}-G{g}  {CHAPTERS[ch-1][0]}（{CHAPTERS[ch-1][1]}）· G{g} {GAMES[g-1]}")
        return 0

    if not (a.ch and a.game and a.src):
        ap.error("需要 --ch、--game、--src（或使用 --next）")
    if not (1 <= a.ch <= 14 and 1 <= a.game <= 3):
        ap.error("--ch 範圍 1–14，--game 範圍 1–3")

    src = Path(a.src).read_text(encoding="utf-8")
    t = re.search(r"<title>(.*?)</title>", src, re.S | re.I)
    full = t.group(1).strip() if t else f"[MOM-CH{a.ch}-G{a.game}] {CHAPTERS[a.ch-1][0]}"
    subtitle = re.sub(r"^\[MOM-CH\d+-G\d\]\s*", "", full)
    subtitle = re.sub(r"^.*?\s-\s", "", subtitle, count=1)  # 去掉英文章名

    fname = f"ch{a.ch:02d}-g{a.game}.html"
    out = COURSE / fname
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(build_page(src), encoding="utf-8")

    date = a.date or datetime.now(TZ).isoformat(timespec="minutes")
    m["entries"] = [e for e in m["entries"] if not (e["ch"] == a.ch and e["game"] == a.game)]
    m["entries"].append({
        "ch": a.ch, "game": a.game, "code": f"MOM-CH{a.ch}-G{a.game}",
        "title": subtitle, "full_title": full, "file": fname, "published": date,
    })
    save_manifest(m)
    print(f"OK  MOM-CH{a.ch}-G{a.game}  {subtitle}  -> courses/mechanics-of-materials/{fname}")


if __name__ == "__main__":
    sys.exit(main())
