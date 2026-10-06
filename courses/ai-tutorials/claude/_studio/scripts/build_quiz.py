#!/usr/bin/env python3
"""由 data/quizzes/<id>.json 產生互動測驗頁。

用法（在 courses/ai-tutorials/claude/ 下）：
  python3 _studio/scripts/build_quiz.py data/quizzes/<id>.json --out <series>/<檔名>.html
檢查：題數、答案索引、zh/en 欄位齊全；失敗時回傳非 0。
"""
import argparse, json, sys
from pathlib import Path

ap = argparse.ArgumentParser()
ap.add_argument("quiz"); ap.add_argument("--out", required=True)
a = ap.parse_args()
Q = json.loads(Path(a.quiz).read_text(encoding="utf-8"))

def need(o, where):
    for l in ("zh", "en"):
        if not (isinstance(o, dict) and o.get(l, "").strip()):
            sys.exit(f"缺少 {l}：{where}")
for k in ("title", "intro"): need(Q[k], k)
ids = set()
for i, q in enumerate(Q["questions"], 1):
    w = f"Q{i}"
    need(q["q"], w + ".q"); need(q["why"], w + ".why"); need(q["topic"], w + ".topic")
    if q["id"] in ids: sys.exit("題目 id 重複：" + q["id"])
    ids.add(q["id"])
    if not 3 <= len(q["opts"]) <= 5: sys.exit(w + " 選項需 3–5 個")
    for j, o in enumerate(q["opts"]): need(o, f"{w}.opts[{j}]")
    if not 0 <= q["ans"] < len(q["opts"]): sys.exit(w + " ans 超出範圍")
n = len(Q["questions"])
print(f"{Q['id']}: {n} 題，及格 {Q.get('pass', 80)}%")

TEMPLATE = (Path(__file__).parent.parent / "engine" / "quiz_template.html").read_text(encoding="utf-8")
html = TEMPLATE.replace("/*QUIZ_DATA*/null", json.dumps(Q, ensure_ascii=False))
html = html.replace("{{TITLE_ZH}}", Q["title"]["zh"]).replace("{{TITLE_EN}}", Q["title"]["en"])
Path(a.out).write_text(html, encoding="utf-8")
print("built", a.out)
