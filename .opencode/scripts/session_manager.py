#!/usr/bin/env python3
"""
Session Manager - OpenKit
=================================
Analyzes project state, detects tech stack, tracks file statistics, and provides
a summary of the current session.

Usage:
    python .opencode/scripts/session_manager.py status [path]
    python .opencode/scripts/session_manager.py info [path]
"""

import argparse
import json
import os
from pathlib import Path
from typing import Any, Dict, List


def get_project_root(path: str) -> Path:
    return Path(path).resolve()


# Since I cannot easily add dependencies, I will use a simple efficient line parser for toml/json if needed,
# but for robust python parsing, let's assume standard checks or simple text parsing if toml lib is missing.
# Actually, let's keep it simple and robust with standard library.


def analyze_package_json(path: Path) -> Dict[str, Any]:
    if not path.exists():
        return {}

    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

        deps = data.get("dependencies", {})
        dev_deps = data.get("devDependencies", {})
        all_deps = {**deps, **dev_deps}

        stack = []
        if "next" in all_deps:
            stack.append("Next.js")
        elif "react" in all_deps and "vite" in all_deps:
            stack.append("React (Vite)")
        elif "react" in all_deps:
            stack.append("React")
        elif "vue" in all_deps:
            stack.append("Vue")
        elif "svelte" in all_deps:
            stack.append("Svelte")
        elif "express" in all_deps:
            stack.append("Express")
        elif "nestjs" in all_deps or "@nestjs/core" in all_deps:
            stack.append("NestJS")

        if "tailwindcss" in all_deps:
            stack.append("Tailwind CSS")
        if "prisma" in all_deps:
            stack.append("Prisma")
        if "typescript" in all_deps:
            stack.append("TypeScript")
        if "@tanstack/react-query" in all_deps:
            stack.append("TanStack Query")

        return {
            "name": data.get("name", "unnamed"),
            "version": data.get("version", "0.0.0"),
            "stack": stack,
        }
    except Exception as e:
        return {"error": str(e)}


def analyze_pyproject_toml(path: Path) -> Dict[str, Any]:
    if not path.exists():
        return {}

    try:
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()

        stack = []
        if "fastapi" in content:
            stack.append("FastAPI")
        if "flask" in content:
            stack.append("Flask")
        if "django" in content:
            stack.append("Django")

        if "sqlalchemy" in content:
            stack.append("SQLAlchemy")
        if "psycopg" in content or "psycopg2" in content:
            stack.append("PostgreSQL")
        if "redis" in content:
            stack.append("Redis")
        if "celery" in content:
            stack.append("Celery")
        if "alembic" in content:
            stack.append("Alembic")
        if "pydantic" in content:
            stack.append("Pydantic")

        return {"stack": stack}
    except Exception as e:
        return {"error": str(e)}


def get_full_project_info(root: Path) -> Dict[str, Any]:
    info = {"name": root.name, "path": str(root), "stack": [], "modules": []}

    # Check Frontend
    fe_pkg = root / "frontend/package.json"
    if fe_pkg.exists():
        fe_info = analyze_package_json(fe_pkg)
        info["stack"].extend(fe_info.get("stack", []))
    else:
        # Fallback to root package.json
        root_pkg = root / "package.json"
        if root_pkg.exists():
            root_info = analyze_package_json(root_pkg)
            info["stack"].extend(root_info.get("stack", []))

    # Check Backend
    be_toml = root / "backend/pyproject.toml"
    if be_toml.exists():
        be_info = analyze_pyproject_toml(be_toml)
        info["stack"].extend(be_info.get("stack", []))

    # Remove duplicates and sort
    info["stack"] = sorted(list(set(info["stack"])))

    return info


def count_files(root: Path) -> Dict[str, Any]:
    stats = {"created": 0, "modified": 0, "total": 0}
    # Simple count for now, comprehensive tracking would require git diff or extensive history
    exclude = {
        ".git",
        "node_modules",
        ".next",
        "dist",
        "build",
        ".agent",
        "__pycache__",
    }

    for root_dir, dirs, files in os.walk(root):
        dirs[:] = [d for d in dirs if d not in exclude]
        stats["total"] += len(files)

    return stats


def detect_features(root: Path) -> List[str]:
    # Heuristic: look at folder names in src/ or feature directories
    features = []

    # Check frontend src
    src = root / "frontend/src"
    if src.exists():
        possible_dirs = ["components", "modules", "features", "app", "pages"]
        for d in possible_dirs:
            p = src / d
            if p.exists() and p.is_dir():
                for child in p.iterdir():
                    if child.is_dir():
                        features.append(f"fe:{child.name}")

    # Check backend app
    app = root / "backend/app"
    if app.exists():
        # Check for modular structure if exists, typically routers or modules
        for child in app.iterdir():
            if child.is_dir() and child.name not in ["__pycache__", "core", "tests"]:
                features.append(f"be:{child.name}")

    return features[:15]  # Limit


def print_status(root: Path):
    info = get_full_project_info(root)
    stats = count_files(root)
    features = detect_features(root)

    print("\n=== Project Status ===")
    print(f"\n Project: {info['name']}")
    print(f" Path: {info['path']}")
    print("  Type: Full Stack")
    print(" Status: Active")

    print("\n Tech Stack:")
    if info["stack"]:
        for tech in info["stack"]:
            print(f"   • {tech}")
    else:
        print("   (No specific stack detected)")

    print(f"\n Detected Modules/Features ({len(features)}):")
    for feat in features:
        print(f"   • {feat}")
    if not features:
        print("   (No distinct feature modules detected)")

    print(f"\n Files: {stats['total']} total files tracked")
    print("\n====================\n")


def main():
    parser = argparse.ArgumentParser(description="Session Manager")
    parser.add_argument("command", choices=["status", "info"], help="Command to run")
    parser.add_argument("path", nargs="?", default=".", help="Project path")

    args = parser.parse_args()
    root = get_project_root(args.path)

    if args.command == "status":
        print_status(root)
    elif args.command == "info":
        print(json.dumps(get_full_project_info(root), indent=2))


if __name__ == "__main__":
    main()
