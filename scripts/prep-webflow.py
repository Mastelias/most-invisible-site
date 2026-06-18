#!/usr/bin/env python3
"""
Prep step for the Webflow -> Sanity blog import.

Reads the Webflow CSV export, keeps published posts, sorts by publish date
(newest first), takes the top N, and writes a clean JSON file that the Node
importer (import-webflow.mjs) consumes.

Usage:
  python3 scripts/prep-webflow.py [csv_path] [limit] [out_path]

Defaults: csv in ~/Downloads, limit 100, out scripts/webflow-posts.json
"""
import csv, re, json, sys, os
from datetime import datetime, timezone

DEFAULT_CSV = os.path.expanduser(
    "~/Downloads/Most Invisible - Blog posts - 622232b5743770c43be7ad93.csv"
)
csv_path = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_CSV
limit = int(sys.argv[2]) if len(sys.argv) > 2 else int(os.environ.get("IMPORT_LIMIT", "100"))
out_path = sys.argv[3] if len(sys.argv) > 3 else "scripts/webflow-posts.json"


def parse_date(s):
    s = re.sub(r" GMT.*$", "", (s or "").strip())
    try:
        return datetime.strptime(s, "%a %b %d %Y %H:%M:%S").replace(tzinfo=timezone.utc)
    except ValueError:
        return None


with open(csv_path, newline="", encoding="utf-8") as f:
    rows = list(csv.DictReader(f))

for r in rows:
    r["_pub"] = parse_date(r["Published On"]) or parse_date(r["Date"])

rows = [
    r for r in rows
    if r["_pub"] and r.get("Draft") == "false" and r.get("Archived") == "false"
]
rows.sort(key=lambda r: r["_pub"], reverse=True)
selected = rows[:limit]

posts = [{
    "itemId": r["Item ID"].strip(),
    "title": r["Name"].strip(),
    "slug": r["Slug"].strip(),
    "publishedAt": r["_pub"].isoformat(),
    "excerpt": r["Post summary"].strip(),
    "category": r["Category"].strip(),
    "heroImage": r["Hero image"].strip(),
    "content": r["Content"],
} for r in selected]

os.makedirs(os.path.dirname(out_path), exist_ok=True)
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(posts, f, ensure_ascii=False)

print(f"Wrote {len(posts)} posts to {out_path}")
if posts:
    print(f"  newest: {posts[0]['publishedAt'][:10]} — {posts[0]['title'][:50]}")
    print(f"  oldest: {posts[-1]['publishedAt'][:10]} — {posts[-1]['title'][:50]}")
