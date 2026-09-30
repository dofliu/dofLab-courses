#!/usr/bin/env python3
"""重建「Claude AI 應用」課程目錄資料 course.js。

用法：python3 tools/build_claude_course.py

讀取 courses/ai-tutorials/claude/data/catalog.json（已上線集數）與 curriculum.json（全部單元與狀態），
寫出 courses/ai-tutorials/claude/course.js，供課程目錄頁與 AI 使用教學主題頁讀取。
每次新增或修改集數後執行一次。
"""
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
C = ROOT / "courses" / "ai-tutorials" / "claude"
cat = json.loads((C / "data" / "catalog.json").read_text(encoding="utf-8"))
cur = json.loads((C / "data" / "curriculum.json").read_text(encoding="utf-8"))
plan = [{"id": u["id"], "series": u["series"], "type": u["type"], "no": u.get("no"),
         "title": u["title"], "title_en": u.get("title_en", ""), "status": u["status"]}
        for u in cur["units"] if u["series"] != "_shared"]
live = sum(1 for u in plan if u["status"] == "done")
data = {"catalog": cat, "plan": plan, "live": live, "total": len(plan)}
out = "/* 由 tools/build_claude_course.py 自動產生，請勿手動編輯 */\nwindow.CLAUDE_COURSE = " + json.dumps(data, ensure_ascii=False, indent=1) + ";\n"
(C / "course.js").write_text(out, encoding="utf-8")
print(f"course.js: {live}/{len(plan)} 單元已上線")
