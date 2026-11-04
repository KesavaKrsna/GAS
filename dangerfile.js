const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Absolute path so Danger's transpiled runner can still load the helpers.
// A relative require breaks when Danger evaluates this file outside the repo root.
function loadRules() {
  const candidates = [
    path.join(process.cwd(), ".github/danger/rules.js"),
  ];
  if (typeof __dirname !== "undefined") {
    candidates.push(path.join(__dirname, ".github/danger/rules.js"));
  }
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return require(candidate);
    }
  }
  throw new Error("Could not find .github/danger/rules.js from " + process.cwd());
}

const rules = loadRules();

const BASE_REF = "refs/remotes/origin/pr-base";

function readAgreedFile() {
  try {
    return fs.readFileSync(".github/production-branch", "utf8");
  } catch (_error) {
    return "";
  }
}

function commitsBehind(exec = execFileSync) {
  const out = exec("git", ["rev-list", "--count", `HEAD..${BASE_REF}`], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const count = Number(String(out).trim());
  if (!Number.isFinite(count)) {
    throw new Error(`unexpected git rev-list output: ${String(out).trim()}`);
  }
  return count;
}

async function review({
  danger,
  fail,
  warn,
  message = () => {},
  countBehind = commitsBehind,
  productionBranchEnv = process.env.PRODUCTION_BRANCH,
}) {
  const agreed = rules.agreedProductionBranch(productionBranchEnv, readAgreedFile());
  const base = danger.github.pr.base.ref;
  const labels = (danger.github.issue && danger.github.issue.labels) || [];

  if (!agreed.branch) {
    fail(
      "No production branch is configured. Set the PRODUCTION_BRANCH repository variable or commit `.github/production-branch`.",
    );
  } else if (!rules.hasAllowBranchLabel(labels) && base !== agreed.branch) {
    fail(rules.wrongTargetMessage(base, agreed.branch));
  } else if (agreed.branch && rules.hasAllowBranchLabel(labels) && base !== agreed.branch) {
    message(
      `\`allow-branch\` is set, so targeting \`${base}\` instead of \`${agreed.branch}\` is allowed.`,
    );
  }

  try {
    const behind = countBehind();
    if (rules.shouldWarnBehind(behind)) {
      warn(rules.behindMessage(behind, base));
    }
  } catch (error) {
    const detail = error && error.message ? error.message : String(error);
    warn(
      `Could not measure how far this branch is behind \`${base}\`. ${detail}`,
    );
  }

  if (rules.descriptionTooShort(danger.github.pr.body)) {
    warn(
      "This PR has no real description. Add a short summary of what changed and how to verify it.",
    );
  }

  const files = [
    ...danger.git.created_files,
    ...danger.git.modified_files,
    ...danger.git.deleted_files,
  ];
  const lines =
    (danger.github.pr.additions || 0) + (danger.github.pr.deletions || 0);
  if (rules.isLargePr({ lines, files: files.length })) {
    warn(
      `This PR is large (${lines} lines across ${files.length} files; warns above ${rules.LARGE_PR_LINE_LIMIT} lines or ${rules.LARGE_PR_FILE_LIMIT} files). Consider splitting it.`,
    );
  }

  const drift = rules.lockfileDrift(files);
  if (drift.warn) {
    warn(
      `Lockfile changes (${drift.locks.join(", ")}) without a \`package.json\` or \`pnpm-workspace.yaml\` change. Confirm the lockfile update is intentional.`,
    );
  }

  const touched = [
    ...danger.git.created_files,
    ...danger.git.modified_files,
  ];
  for (const file of touched.filter(rules.isEnvFile)) {
    warn(
      `\`${file}\` looks like an environment file. Keep secrets out of git and commit \`.env.example\` only.`,
    );
  }

  for (const file of touched.filter(rules.shouldScanForSecrets)) {
    const diff = await danger.git.diffForFile(file);
    const hits = rules.findSecrets(diff && diff.added);
    if (hits.length === 0) continue;
    const names = [...new Set(hits)];
    warn(
      `Possible secret material in \`${file}\` (${names.join(", ")}). Remove it before merging and rotate the credential if it has been exposed.`,
    );
  }
}

if (typeof schedule === "function") {
  const scheduled = review({ danger, fail, warn, message }).catch((error) => {
    const detail = error && error.message ? error.message : String(error);
    fail(`Danger rules crashed: ${detail}`);
  });
  schedule(scheduled);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    review,
    commitsBehind,
    BASE_REF,
  };
}
