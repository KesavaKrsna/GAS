const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const rules = require("./rules");
const { review } = require("../../dangerfile");

const root = path.join(__dirname, "..", "..");

test("repo variable overrides the production-branch file", () => {
  const agreed = rules.agreedProductionBranch(
    "release",
    "cursor/gas-proposal-build\n",
  );
  assert.equal(agreed.branch, "release");
  assert.equal(agreed.source, "PRODUCTION_BRANCH");
});

test("empty variable falls back to the file", () => {
  const agreed = rules.agreedProductionBranch(
    "  ",
    "cursor/gas-proposal-build\n",
  );
  assert.equal(agreed.branch, "cursor/gas-proposal-build");
  assert.equal(agreed.source, ".github/production-branch");
});

test("allow-branch label is an exact name match", () => {
  assert.equal(
    rules.hasAllowBranchLabel([{ name: "allow-branch" }, { name: "bug" }]),
    true,
  );
  assert.equal(rules.hasAllowBranchLabel([{ name: "Allow-Branch" }]), false);
  assert.equal(rules.hasAllowBranchLabel([]), false);
});

test("behind warning starts above 20 commits", () => {
  assert.equal(rules.shouldWarnBehind(20), false);
  assert.equal(rules.shouldWarnBehind(21), true);
  assert.match(rules.behindMessage(21, "cursor/gas-proposal-build"), /21/);
});

test("env files ignore examples, samples, and templates", () => {
  assert.equal(rules.isEnvFile(".env"), true);
  assert.equal(rules.isEnvFile("artifacts/api-server/.env.local"), true);
  assert.equal(rules.isEnvFile(".env.example"), false);
  assert.equal(rules.isEnvFile(".env.sample"), false);
  assert.equal(rules.isEnvFile("config/.env.template"), false);
});

test("lockfile changes without a manifest warn", () => {
  assert.equal(rules.lockfileDrift(["pnpm-lock.yaml"]).warn, true);
  assert.equal(
    rules.lockfileDrift(["pnpm-lock.yaml", "package.json"]).warn,
    false,
  );
  assert.equal(
    rules.lockfileDrift([
      "lib/db/package.json",
      "pnpm-lock.yaml",
    ]).warn,
    false,
  );
  assert.equal(
    rules.lockfileDrift(["pnpm-lock.yaml", "pnpm-workspace.yaml"]).warn,
    false,
  );
});

test("large PR thresholds", () => {
  assert.equal(rules.isLargePr({ lines: 500, files: 30 }), false);
  assert.equal(rules.isLargePr({ lines: 501, files: 1 }), true);
  assert.equal(rules.isLargePr({ lines: 1, files: 31 }), true);
});

test("secret scan catches common tokens and skips placeholders", () => {
  const live = rules.findSecrets(
    [
      "const key = 'sk_live_" + "abcdefghijklmnop';",
      "token ghp_" + "abcdefghijklmnopqrstuvwxyz123456",
      "aws AKIA" + "IOSFODNN7EXAMPLE",
    ].join("\n"),
  );
  assert.deepEqual(live, ["Paystack secret key", "GitHub token"]);

  assert.deepEqual(
    rules.findSecrets(["api_key = '", "supersecretvalue'"].join("")),
    ["assigned secret"],
  );
  assert.deepEqual(
    rules.findSecrets("PAYSTACK_SECRET_KEY=\n# example sk_live_abcdefghijklmnop"),
    [],
  );
});

test("this pilot's own source does not trip the secret scan", () => {
  for (const relative of [
    "dangerfile.js",
    ".github/danger/rules.js",
    ".github/danger/rules.test.js",
    "docs/code-review-bot.md",
    ".github/workflows/danger.yml",
    ".github/workflows/semgrep.yml",
    ".github/workflows/production-branch-guard.yml",
    ".github/scripts/check-production-branch.py",
  ]) {
    const text = fs.readFileSync(path.join(root, relative), "utf8");
    assert.deepEqual(rules.findSecrets(text), [], relative);
  }
  assert.equal(rules.shouldScanForSecrets("dangerfile.js"), false);
  assert.equal(rules.shouldScanForSecrets(".github/danger/rules.js"), false);
  assert.equal(rules.shouldScanForSecrets("docs/code-review-bot.md"), false);
  assert.equal(rules.shouldScanForSecrets("artifacts/api-server/src/app.ts"), true);
});

function mockDanger(overrides = {}) {
  return {
    github: {
      pr: {
        base: { ref: "cursor/gas-proposal-build" },
        body: "A description long enough to count as a real summary.",
        additions: 10,
        deletions: 2,
        ...(overrides.pr || {}),
      },
      issue: {
        labels: overrides.labels || [],
      },
    },
    git: {
      created_files: overrides.created || [],
      modified_files: overrides.modified || [],
      deleted_files: overrides.deleted || [],
      diffForFile: async (file) => ({
        added: (overrides.diffs || {})[file] || "",
      }),
    },
  };
}

function runReview(overrides = {}, extra = {}) {
  const fails = [];
  const warns = [];
  const messages = [];
  return review({
    danger: mockDanger(overrides),
    fail: (message) => fails.push(message),
    warn: (message) => warns.push(message),
    message: (message) => messages.push(message),
    countBehind: extra.countBehind || (() => 0),
    productionBranchEnv:
      extra.productionBranchEnv === undefined ? "" : extra.productionBranchEnv,
  }).then(() => ({ fails, warns, messages }));
}

test("review fails when the PR targets a branch other than production", async () => {
  const { fails, warns } = await runReview({ pr: { base: { ref: "main" } } });
  assert.equal(fails.length, 1);
  assert.match(fails[0], /targets `main`/);
  assert.match(fails[0], /cursor\/gas-proposal-build/);
  assert.equal(warns.length, 0);
});

test("allow-branch label lets a non-production target through", async () => {
  const { fails, messages } = await runReview({
    pr: { base: { ref: "main" } },
    labels: [{ name: "allow-branch" }],
  });
  assert.deepEqual(fails, []);
  assert.match(messages.join("\n"), /allow-branch/);
});

test("PRODUCTION_BRANCH variable overrides the committed file", async () => {
  const { fails } = await runReview(
    { pr: { base: { ref: "main" } } },
    { productionBranchEnv: "main" },
  );
  assert.deepEqual(fails, []);
});

test("review warns when the branch is far behind, not when it is close", async () => {
  const behind = await runReview({}, { countBehind: () => 21 });
  assert.equal(behind.warns.length, 1);
  assert.match(behind.warns[0], /21/);

  const close = await runReview({}, { countBehind: () => 20 });
  assert.deepEqual(close.warns, []);
});

test("review warns on description, size, lockfile, env, and secrets", async () => {
  const { warns } = await runReview({
    pr: { body: "short", additions: 400, deletions: 200 },
    created: [".env", "src/pay.ts"],
    modified: ["pnpm-lock.yaml"],
    diffs: {
      "src/pay.ts": "export const key = 'sk_live_" + "abcdefghijklmnop';",
    },
  });
  const text = warns.join("\n");
  assert.match(text, /no real description/);
  assert.match(text, /large/i);
  assert.match(text, /Lockfile/);
  assert.match(text, /\.env/);
  assert.match(text, /Paystack secret key/);
});
