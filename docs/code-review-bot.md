# Open-source PR review (pilot)

CodeRabbit-style review for this repository, using open-source tools and the default `GITHUB_TOKEN` only. Nothing here is a paid GitHub App, and nothing sends the diff to Semgrep Cloud.

The pilot is advisory except for one hard failure: a pull request whose base branch is not the agreed production branch.

## What runs

| Piece | Job | When it runs |
| --- | --- | --- |
| [Danger JS](https://danger.systems/js/) 14.1.0 | PR hygiene | every pull request |
| [Semgrep](https://semgrep.dev/) Community Edition | security and logic findings, SARIF | every pull request, plus manual dispatch |
| [reviewdog](https://github.com/reviewdog/reviewdog) 0.21.0 | inline PR comments for Semgrep SARIF | pull requests, inside the Semgrep job |
| `production-branch-guard` | Vercel production branch vs the agreed branch | weekdays 06:15 UTC, plus manual dispatch |
| [PR-Agent](https://github.com/qodo-ai/pr-agent) | not installed | off |

Existing workflow files were left untouched. These are new files only. Danger is installed in the runner's temp directory so `package.json` and `pnpm-lock.yaml` stay as they are (the root `preinstall` script rejects npm inside this repo).

## Comparison

### Danger JS

Danger runs a small program against the pull request and posts one comment. It is good at rules that are about the pull request itself: which branch it targets, how far behind that branch the head is, whether the description is empty, whether a lockfile changed on its own. It is not a security scanner. No account and no extra token. License: MIT.

This is the tool that encodes the mix-up this repo just hit: a pull request aimed at the wrong branch, or a head that is far behind the base and therefore drags in unrelated production changes.

### Semgrep OSS

The Community Edition CLI (`semgrep scan`) is LGPL-2.1. `semgrep scan --config auto` pulls the public registry ruleset for the languages in the repo. It does not need `SEMGREP_APP_TOKEN`.

`semgrep ci` is the other command. That one talks to Semgrep AppSec Platform, and PR comments from Semgrep itself are a platform feature. This pilot does not use `semgrep ci` and does not want that token. Adding `SEMGREP_APP_TOKEN` later would change the job into the hosted product; don't add it for this pilot.

Findings are written as SARIF and uploaded to GitHub code scanning (`security-events: write`). The scan does not fail the check when it finds issues (`--error` is off). That keeps the pilot from blocking every existing finding while the rules are still new.

### reviewdog

reviewdog turns linter output into GitHub pull request review comments. The usual pairing is ESLint (`reviewdog/action-eslint`) or `tsc`.

This repository has no ESLint config and no `eslint` dependency. Formatting is Prettier, and types are `tsc` (`pnpm typecheck`). An ESLint reviewdog job would have nothing to run, so it is not part of the pilot. Wiring `tsc` would also mean a full `pnpm install` on every pull request, which this pilot does not do.

reviewdog is still installed, for a different reason: Semgrep Community Edition does not comment on the pull request. reviewdog reads `semgrep.sarif` and posts inline comments on changed lines (`-filter-mode=diff_context`, `-fail-level=none`). That is the open-source stand-in for Semgrep Cloud's PR comments.

When an ESLint config lands, add a second reviewdog step pointed at ESLint, with the same `pull-requests: write` permission, and keep `fail_level` at `none` until the rule set is quiet.

### PR-Agent

PR-Agent (Qodo) is open source and can write a full review, but it needs an LLM API key (typically `OPENAI_KEY`). The published GitHub Action also asks for `issues: write` and often `contents: write`, which is wider than the token this pilot uses.

It is optional and off. There is no workflow file for it, so it cannot run by accident. Turning it on later is a separate change: a workflow, a secret, and an explicit decision to widen permissions. Adding only the API key does nothing.

## Why this set

The bug we are guarding against is process as well as code. Danger is the only one of the four that can fail a pull request for targeting `main` when production is `cursor/gas-proposal-build`, or warn when the head is more than 20 commits behind that base. Semgrep covers the security and bug-pattern comments a review bot is actually good at, without a paid app. reviewdog is how those findings show up on the diff, because Semgrep's own PR comments are not in the OSS command. PR-Agent overlaps both and adds a model key and a broader token, so it stays off.

## Agreed production branch

Committed source of truth: [`.github/production-branch`](../.github/production-branch). The value is `cursor/gas-proposal-build`.

Optional override: Actions variable `PRODUCTION_BRANCH`. When that variable is non-empty, Danger and the Vercel guard both use it instead of the file. If the variable and the file disagree, the guard prints a warning and still follows the variable. Clear the variable to go back to the file. Keep them the same unless you mean to override.

Bypass for an intentional exception: add the label `allow-branch` to the pull request. The name is case-sensitive. The label does not exist in the repo yet; create it before relying on the bypass (the pilot cannot create labels).

## Danger rules

Installed from npm as `danger@14.1.0` and run with `danger ci --failOnErrors`.

1. **Fail** when `base.ref` is not the agreed production branch, unless the pull request has the `allow-branch` label. If neither the variable nor `.github/production-branch` is set, Danger fails closed.
2. **Warn** when the head is more than 20 commits behind the base (`git rev-list --count HEAD..<base>`). 20 does not warn; 21 does. The workflow checks out the pull request head (not the synthetic merge commit) and fetches the base into `refs/remotes/origin/pr-base` before Danger runs. If that comparison cannot be run, Danger warns instead of failing.
3. **Warn** on the hygiene list below. Warnings do not fail the job.
   - Large pull request: more than 500 changed lines (`additions + deletions`) or more than 30 files.
   - Missing description: trimmed body shorter than 20 characters.
   - A lockfile (`pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`, `npm-shrinkwrap.json`, `bun.lock`) changes without any `package.json` or `pnpm-workspace.yaml` change.
   - An env file is added or modified. `.env.example`, `.env.sample`, and `.env.template` are allowed.
   - Added lines that look like an AWS access key id, a private key block, a GitHub token, a Slack token, an OpenAI-style key, a Paystack secret key, or a quoted assignment of `api_key` / `secret` / `password` / `access_token`. Placeholder lines (the word "example", "redacted", "changeme", and similar) are ignored. The comment names the file and the pattern; it does not repeat the secret. The Danger sources and this document are not scanned, so the patterns themselves do not trip the rule.

## Semgrep and reviewdog

Workflow: [`.github/workflows/semgrep.yml`](../.github/workflows/semgrep.yml).

```text
docker run --entrypoint semgrep semgrep/semgrep \
  scan --config auto --metrics=off \
  --exclude attached_assets --exclude pnpm-lock.yaml \
  --sarif-output=semgrep.sarif
```

`--config auto` is the documented Community Edition ruleset. `--metrics=off` keeps the run from reporting usage to Semgrep. The image entrypoint is forced to `semgrep` so the arguments stay `scan ...` even if the image entrypoint changes.

`github/codeql-action/upload-sarif@v3` uploads the report. On pull requests, reviewdog posts a review with `-reporter=github-pr-review` and `-fail-level=none`, limited to the diff. A clean SARIF file uploads and comments nothing. A Semgrep crash fails the job; findings do not.

To start blocking on findings later, add `--error` to the scan and set reviewdog `-fail-level=error`.

## Token permissions

Every workflow uses the default `GITHUB_TOKEN` and sets `permissions` so unspecified scopes are none.

| Workflow | Permissions |
| --- | --- |
| Danger | `contents: read`, `pull-requests: write` |
| Semgrep | `contents: read`, `pull-requests: write`, `security-events: write` |
| production-branch-guard | `contents: read` |

The guard does not comment on pull requests. It only reads the committed branch file and, when the secret exists, the Vercel API.

Fork pull requests receive a read-only token, so Danger and reviewdog cannot comment on them. Same-repo pull requests can. `pull_request_target` is not used.

GitHub caps a workflow's `permissions` at the repository's Actions policy. If the policy is read-only, comments will not post even though these files request write. In that case set **Settings → Actions → General → Workflow permissions** so the token may write to pull requests. The workflows still request only the scopes above.

## Production branch guard

Workflow: [`.github/workflows/production-branch-guard.yml`](../.github/workflows/production-branch-guard.yml).

On weekdays at 06:15 UTC, and whenever someone runs it by hand, the job reads:

```text
GET https://api.vercel.com/v9/projects/gas-api-server-pu7z?slug=kesavakrsnas-projects
```

and compares `link.productionBranch` with the agreed branch (the `PRODUCTION_BRANCH` variable if set, otherwise `.github/production-branch`).

- **`VERCEL_TOKEN` missing:** print a `::notice::` and exit 0. The job does not fail.
- **Token set, but the API errors, the project has no `link.productionBranch`, or the branches differ:** print a `::error::` and exit 1. The token is not written to the log.

### Secret the owner has to add

| Name | Where | What it is |
| --- | --- | --- |
| `VERCEL_TOKEN` | GitHub → this repo → Settings → Secrets and variables → Actions → Repository secrets | A Vercel access token that can read project `gas-api-server-pu7z` on team `kesavakrsnas-projects`. Create one at [vercel.com/account/tokens](https://vercel.com/account/tokens). Read access is enough. |

Do not commit the token, and do not put it in an Actions variable (variables are not secret). Until the secret exists, the guard stays green and only logs the notice.

Optional, not a secret: Actions variable `PRODUCTION_BRANCH`, only if you need to override `.github/production-branch` without a commit.

Also create the `allow-branch` label if you want the Danger bypass.

### Schedule only runs from the default branch

GitHub schedules a workflow, and lists it for manual dispatch, only when the file is on the repository default branch. The default branch here is `main`. This pilot targets `cursor/gas-proposal-build`. Merging it there does not start the weekday run. The guard starts on its schedule after the workflow file is on `main` as well. Until then you can still read the script, and the unit tests below cover the skip and mismatch behavior.

## How to verify

Locally, from the repo root:

```bash
node --test .github/danger/rules.test.js
python3 .github/scripts/check-production-branch_test.py
```

On GitHub:

1. This pull request targets `cursor/gas-proposal-build`. The Danger job should not fail the branch rule.
2. Create the `allow-branch` label.
3. Open a scratch pull request whose base is `main` (or any branch other than the agreed one). Danger should fail. Add `allow-branch` and re-run the job: that failure clears, and Danger leaves a note that the label allowed the target.
4. Open a pull request whose head is more than 20 commits behind its base. Danger should warn, and the check should still pass.
5. The Semgrep job should upload SARIF. reviewdog comments on changed lines only when the scan reports a finding in the diff. Neither findings nor an empty report fail the job.
6. After `production-branch-guard.yml` is on `main`, run it from the Actions tab. With no `VERCEL_TOKEN`, the log contains the notice and the job is green. After the secret is added, a Vercel production branch other than the agreed branch fails the job.

## Files

| Path | Purpose |
| --- | --- |
| `.github/production-branch` | Agreed production branch (`cursor/gas-proposal-build`) |
| `.github/workflows/danger.yml` | Danger check |
| `.github/workflows/semgrep.yml` | Semgrep CE scan, SARIF upload, reviewdog comments |
| `.github/workflows/production-branch-guard.yml` | Scheduled Vercel comparison |
| `dangerfile.js` | Danger entrypoint |
| `.github/danger/rules.js` | Rule helpers |
| `.github/danger/rules.test.js` | Rule tests |
| `.github/scripts/check-production-branch.py` | Vercel comparison |
| `.github/scripts/check-production-branch_test.py` | Guard tests, including the missing-token skip |
| `docs/code-review-bot.md` | This note |
