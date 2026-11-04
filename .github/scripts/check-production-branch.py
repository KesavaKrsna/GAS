#!/usr/bin/env python3
"""Compare the Vercel project's production branch with the agreed branch.

A missing VERCEL_TOKEN skips the check with a notice and exit 0.
Any other failure, including a branch mismatch, exits 1.
The token value is never printed.
"""

from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

DEFAULT_PROJECT = "gas-api-server-pu7z"
DEFAULT_TEAM_SLUG = "kesavakrsnas-projects"
AGREED_FILE = ".github/production-branch"


def annotation(level: str, message: str) -> None:
    safe = message.replace("%", "%25").replace("\r", "%0D").replace("\n", "%0A")
    print(f"::{level}::{safe}")


def agreed_branch(env_value: str, file_text: str) -> tuple[str, str]:
    from_env = (env_value or "").strip()
    from_file = (file_text or "").strip()
    if from_env:
        return from_env, "PRODUCTION_BRANCH"
    if from_file:
        return from_file, AGREED_FILE
    return "", "missing"


def production_branch_from_project(payload: dict) -> str:
    link = payload.get("link") or {}
    if not isinstance(link, dict):
        return ""
    return str(link.get("productionBranch") or "").strip()


def fetch_project(token: str, project: str, team_slug: str) -> dict:
    project_q = urllib.parse.quote(project, safe="")
    slug_q = urllib.parse.quote(team_slug, safe="")
    url = f"https://api.vercel.com/v9/projects/{project_q}?slug={slug_q}"
    request = urllib.request.Request(
        url,
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/json",
        },
        method="GET",
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)


def load_project(token: str, project: str, team_slug: str) -> dict:
    # Test-only. Workflows must not set VERCEL_PROJECT_JSON.
    override = os.environ.get("VERCEL_PROJECT_JSON", "").strip()
    if override:
        return json.loads(override)
    return fetch_project(token, project, team_slug)


def main() -> int:
    token = os.environ.get("VERCEL_TOKEN", "").strip()
    if not token:
        annotation(
            "notice",
            "VERCEL_TOKEN repo secret is not set, so the Vercel production-branch "
            "check was skipped and did not fail. Add a Vercel token that can read "
            f"project {DEFAULT_PROJECT} on team {DEFAULT_TEAM_SLUG}. "
            "See docs/code-review-bot.md.",
        )
        return 0

    project = os.environ.get("VERCEL_PROJECT", "").strip() or DEFAULT_PROJECT
    team_slug = os.environ.get("VERCEL_TEAM_SLUG", "").strip() or DEFAULT_TEAM_SLUG

    try:
        file_text = open(AGREED_FILE, encoding="utf-8").read()
    except OSError as error:
        annotation("error", f"Could not read {AGREED_FILE}: {error}")
        return 1

    env_branch = os.environ.get("PRODUCTION_BRANCH", "")
    agreed, source = agreed_branch(env_branch, file_text)
    file_branch = file_text.strip()
    if env_branch.strip() and file_branch and env_branch.strip() != file_branch:
        annotation(
            "warning",
            f"PRODUCTION_BRANCH ({env_branch.strip()}) differs from {AGREED_FILE} "
            f"({file_branch}). The variable wins for this check. Keep them in sync.",
        )

    if not agreed:
        annotation(
            "error",
            "No agreed production branch. Set the PRODUCTION_BRANCH repository "
            f"variable or commit {AGREED_FILE}.",
        )
        return 1

    try:
        payload = load_project(token, project, team_slug)
    except urllib.error.HTTPError as error:
        annotation(
            "error",
            f"Vercel API returned HTTP {error.code} for project {project} "
            f"(team {team_slug}). Check that VERCEL_TOKEN can read this project. "
            "The token value was not printed.",
        )
        return 1
    except Exception as error:  # noqa: BLE001 - report any read failure, never the token
        annotation(
            "error",
            f"Could not read the Vercel project: {type(error).__name__}: {error}",
        )
        return 1

    vercel_branch = production_branch_from_project(payload)
    print(f"Agreed production branch ({source}): {agreed}")
    print(f"Vercel project {project} production branch: {vercel_branch or '(missing)'}")

    if not vercel_branch:
        annotation(
            "error",
            f"Vercel project {project} has no link.productionBranch. "
            "Connect the project to Git, or confirm the project name and team slug.",
        )
        return 1

    if vercel_branch != agreed:
        annotation(
            "error",
            f"Production branch mismatch: Vercel project {project} is set to "
            f"'{vercel_branch}', but the agreed branch is '{agreed}' ({source}).",
        )
        return 1

    print("Production branches match.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
