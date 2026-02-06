#!/usr/bin/env python3
"""
Auto Preview - OpenKit
==============================
Manages (start/stop/status) the local development environment using Docker Compose.

Usage:
    python .opencode/scripts/auto_preview.py start
    python .opencode/scripts/auto_preview.py stop
    python .opencode/scripts/auto_preview.py status
"""

import argparse
import os
import subprocess
import sys
from pathlib import Path


def get_project_root():
    return Path(".").resolve()


def get_docker_compose_file(root):
    # Prefer dev config
    dev_config = root / "docker-compose.dev.yml"
    if dev_config.exists():
        return "docker-compose.dev.yml"

    # Fallback to standard
    std_config = root / "docker-compose.yml"
    if std_config.exists():
        return "docker-compose.yml"

    return None


def run_docker_command(cmd_args, root_path):
    compose_file = get_docker_compose_file(root_path)
    if not compose_file:
        print(" No docker-compose.dev.yml or docker-compose.yml found in root.")
        sys.exit(1)

    base_cmd = ["docker", "compose", "-f", compose_file]
    full_cmd = base_cmd + cmd_args

    try:
        subprocess.run(full_cmd, cwd=str(root_path), check=True)
    except subprocess.CalledProcessError as e:
        print(f" Docker command failed: {e}")
        sys.exit(1)
    except FileNotFoundError:
        print(" Docker not found. Please verify it is installed and in your PATH.")
        sys.exit(1)


def start_server():
    root = get_project_root()
    print(" Starting development environment (detached)...")
    # Up detached
    run_docker_command(["up", "-d"], root)
    print(" Environment started.")
    print(" Frontend: http://localhost:5173 (likely)")
    print(" Backend:  http://localhost:8000 (likely)")


def stop_server():
    root = get_project_root()
    print(" Stopping development environment...")
    run_docker_command(["stop"], root)  # Just stop, don't remove containers usually
    print(" Environment stopped.")


def status_server():
    root = get_project_root()
    print("\n=== Docker Compose Status ===")
    run_docker_command(["ps"], root)
    print("=============================\n")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=["start", "stop", "status"])
    # Port argument is ignored in Docker mode as ports are defined in compose
    parser.add_argument(
        "port", nargs="?", default="3000", help="Ignored in Docker mode"
    )

    args = parser.parse_args()

    if args.action == "start":
        start_server()
    elif args.action == "stop":
        stop_server()
    elif args.action == "status":
        status_server()


if __name__ == "__main__":
    main()
