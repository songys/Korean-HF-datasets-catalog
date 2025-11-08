#!/usr/bin/env python3
"""
Backfill archive snapshots for Korean datasets from git history.

Similar to Chinese backfill script. Reconstructs missing:
  - docs/data/archive/korean_datasets_YYYYMMDD.json
  - docs/data/archive/statistics_YYYYMMDD.json

Usage:
  python scripts/backfill_archives.py --dry-run
  python scripts/backfill_archives.py --strategy first

After run:
  python scripts/generate_trends.py
  python scripts/generate_changelog.py
"""
import json, os, subprocess, sys, argparse
from collections import OrderedDict
from typing import List, Tuple, Dict

DATA_FILE = "docs/data/korean_datasets.json"
ARCHIVE_DIR = "docs/data/archive"


def run_git(args: List[str]) -> str:
    try:
        r = subprocess.run(["git", *args], stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
        return r.stdout.decode("utf-8", errors="replace").strip()
    except subprocess.CalledProcessError as e:
        print("Git failed:", "git", *args)
        print(e.stderr.decode("utf-8", errors="replace"))
        sys.exit(1)


def get_commits() -> List[Tuple[str, str]]:
    out = run_git(["log", "--pretty=format:%H %ad", "--date=short", "--", DATA_FILE])
    commits = []
    for line in out.splitlines():
        if not line.strip():
            continue
        parts = line.split()
        if len(parts) >= 2:
            sha, date_str = parts[0], parts[1]
            commits.append((sha, date_str))
    return commits


def choose_daily(commits: List[Tuple[str, str]], strategy: str) -> OrderedDict:
    if strategy not in {"last", "first"}:
        raise ValueError("strategy must be last or first")
    rev = list(reversed(commits))  # oldest first
    mapping: Dict[str, str] = OrderedDict()
    for sha, date_str in rev:
        if date_str not in mapping:
            mapping[date_str] = sha
        else:
            if strategy == "last":
                mapping[date_str] = sha  # overwrite with newer in that day
    return mapping


def load_dataset(raw: str) -> Dict:
    data = json.loads(raw)
    if "datasets" not in data:
        raise ValueError("Missing 'datasets' key")
    return data


def compute_statistics(datasets: List[Dict]) -> Dict:
    return {
        "total_datasets": len(datasets),
        "total_downloads": sum(d.get("downloads", 0) for d in datasets),
        "total_likes": sum(d.get("likes", 0) for d in datasets),
        "multilingual_count": sum(1 for d in datasets if len(d.get("languages", [])) > 1),
    }


def backfill(mapping: OrderedDict, dry_run: bool) -> Dict[str, Dict[str, str]]:
    os.makedirs(ARCHIVE_DIR, exist_ok=True)
    results: Dict[str, Dict[str, str]] = {}
    for date_str, sha in mapping.items():
        yyyymmdd = date_str.replace('-', '')
        ds_name = f"korean_datasets_{yyyymmdd}.json"
        st_name = f"statistics_{yyyymmdd}.json"
        ds_path = os.path.join(ARCHIVE_DIR, ds_name)
        st_path = os.path.join(ARCHIVE_DIR, st_name)
        status = {"date": date_str, "commit": sha, "dataset": "skip", "stats": "skip"}
        need_ds = not os.path.exists(ds_path)
        need_st = not os.path.exists(st_path)
        if not (need_ds or need_st):
            status["note"] = "present"
            results[date_str] = status
            continue
        if dry_run:
            status["dataset"] = "would_create" if need_ds else "exists"
            status["stats"] = "would_create" if need_st else "exists"
            results[date_str] = status
            continue
        raw = run_git(["show", f"{sha}:{DATA_FILE}"])
        try:
            data = load_dataset(raw)
        except ValueError as e:
            status["error"] = str(e)
            results[date_str] = status
            continue
        datasets = data.get("datasets", [])
        if need_ds:
            with open(ds_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            status["dataset"] = "created"
        else:
            status["dataset"] = "exists"
        if need_st:
            stats = compute_statistics(datasets)
            doc = {"last_updated": f"{date_str}T00:00:00", "statistics": stats}
            with open(st_path, 'w', encoding='utf-8') as f:
                json.dump(doc, f, ensure_ascii=False, indent=2)
            status["stats"] = "created"
        else:
            status["stats"] = "exists"
        results[date_str] = status
    return results


def summary(results: Dict[str, Dict[str, str]], dry_run: bool):
    created_ds = sum(1 for r in results.values() if r.get("dataset") == "created")
    created_st = sum(1 for r in results.values() if r.get("stats") == "created")
    print("\nBackfill Summary")
    print("="*60)
    print(f"Days processed: {len(results)}")
    if dry_run:
        print(f"(Dry-run) dataset to create: {sum(1 for r in results.values() if r.get('dataset')=='would_create')}")
        print(f"(Dry-run) stats to create: {sum(1 for r in results.values() if r.get('stats')=='would_create')}")
    else:
        print(f"Dataset files created: {created_ds}")
        print(f"Statistics files created: {created_st}")
    errors = [r for r in results.values() if 'error' in r]
    if errors:
        print(f"Errors: {len(errors)}")
        for e in errors[:5]:
            print(f"  - {e['date']}: {e['error']}")
    print("="*60)


def main():
    parser = argparse.ArgumentParser(description="Backfill Korean dataset archives")
    parser.add_argument('--dry-run', action='store_true')
    parser.add_argument('--strategy', choices=['last','first'], default='last')
    args = parser.parse_args()
    if not os.path.isdir('.git'):
        print('Run at repo root.')
        sys.exit(1)
    commits = get_commits()
    if not commits:
        print('No commits for data file.')
        sys.exit(0)
    mapping = choose_daily(commits, strategy=args.strategy)
    print(f"Found {len(mapping)} distinct days in history.")
    results = backfill(mapping, dry_run=args.dry_run)
    summary(results, args.dry_run)
    if args.dry_run:
        print('Dry-run complete.')

if __name__ == '__main__':
    main()
