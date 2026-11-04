#!/usr/bin/env python3
"""Local checks for the production-branch guard. Run from the repo root."""

from __future__ import annotations

import json
import os
import subprocess
import sys
import unittest

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SCRIPT = os.path.join(ROOT, ".github", "scripts", "check-production-branch.py")


class ProductionBranchGuardTest(unittest.TestCase):
    def run_script(self, env: dict[str, str]) -> subprocess.CompletedProcess[str]:
        merged = {
            "PATH": os.environ.get("PATH", ""),
            "PYTHONPATH": os.environ.get("PYTHONPATH", ""),
            "SYSTEMROOT": os.environ.get("SYSTEMROOT", ""),
        }
        merged.update(env)
        return subprocess.run(
            [sys.executable, SCRIPT],
            cwd=ROOT,
            env=merged,
            text=True,
            capture_output=True,
            check=False,
        )

    def test_missing_token_skips_without_failing(self) -> None:
        result = self.run_script({"VERCEL_TOKEN": ""})
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("::notice::", result.stdout)
        self.assertIn("VERCEL_TOKEN", result.stdout)
        self.assertNotIn("::error::", result.stdout)

    def test_mismatch_fails(self) -> None:
        payload = json.dumps({"link": {"productionBranch": "main", "token": "should-not-matter"}})
        result = self.run_script(
            {
                "VERCEL_TOKEN": "test-token-not-real",
                "VERCEL_PROJECT_JSON": payload,
                "PRODUCTION_BRANCH": "",
            }
        )
        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("Production branch mismatch", result.stdout)
        self.assertIn("main", result.stdout)
        self.assertNotIn("test-token-not-real", result.stdout)
        self.assertNotIn("should-not-matter", result.stdout)

    def test_match_passes(self) -> None:
        payload = json.dumps({"link": {"productionBranch": "cursor/gas-proposal-build"}})
        result = self.run_script(
            {
                "VERCEL_TOKEN": "test-token-not-real",
                "VERCEL_PROJECT_JSON": payload,
                "PRODUCTION_BRANCH": "",
            }
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("Production branches match.", result.stdout)

    def test_variable_override_wins_and_warns_when_file_differs(self) -> None:
        payload = json.dumps({"link": {"productionBranch": "main"}})
        result = self.run_script(
            {
                "VERCEL_TOKEN": "test-token-not-real",
                "VERCEL_PROJECT_JSON": payload,
                "PRODUCTION_BRANCH": "main",
            }
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("::warning::", result.stdout)
        self.assertIn("Production branches match.", result.stdout)

    def test_missing_production_branch_field_fails(self) -> None:
        result = self.run_script(
            {
                "VERCEL_TOKEN": "test-token-not-real",
                "VERCEL_PROJECT_JSON": json.dumps({"link": {}}),
                "PRODUCTION_BRANCH": "",
            }
        )
        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("no link.productionBranch", result.stdout)

    def test_invalid_override_fails_without_printing_the_token(self) -> None:
        result = self.run_script(
            {
                "VERCEL_TOKEN": "test-token-not-real",
                "VERCEL_PROJECT_JSON": "{not-json",
                "PRODUCTION_BRANCH": "",
            }
        )
        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn("::error::", result.stdout)
        self.assertNotIn("test-token-not-real", result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()
