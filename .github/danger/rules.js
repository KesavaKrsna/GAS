"use strict";

// Pure PR-hygiene checks shared by dangerfile.js. Keep this file free of
// Danger globals so it can be required from node:test.

const BEHIND_COMMIT_LIMIT = 20;
const LARGE_PR_LINE_LIMIT = 500;
const LARGE_PR_FILE_LIMIT = 30;
const MIN_DESCRIPTION_LENGTH = 20;

const LOCKFILES = new Set([
  "pnpm-lock.yaml",
  "package-lock.json",
  "yarn.lock",
  "npm-shrinkwrap.json",
  "bun.lock",
]);

const MANIFESTS = new Set(["package.json", "pnpm-workspace.yaml"]);

const SECRET_SCAN_SKIP = [
  /^dangerfile\.js$/,
  /^\.github\/danger\//,
  /^docs\/code-review-bot\.md$/,
  /(^|\/)pnpm-lock\.yaml$/,
  /(^|\/)package-lock\.json$/,
  /(^|\/)yarn\.lock$/,
  /^attached_assets\//,
  /\.(png|jpe?g|gif|webp|ico|mp4|mov|pdf|woff2?)$/i,
];

const PLACEHOLDER_LINE =
  /example|placeholder|redacted|changeme|your-domain|<.*>|\bxxx+\b/i;

function basename(file) {
  const parts = String(file).split("/");
  return parts[parts.length - 1];
}

function agreedProductionBranch(envValue, fileText) {
  const fromEnv = String(envValue || "").trim();
  if (fromEnv) {
    return { branch: fromEnv, source: "PRODUCTION_BRANCH" };
  }
  const fromFile = String(fileText || "").trim();
  if (fromFile) {
    return { branch: fromFile, source: ".github/production-branch" };
  }
  return { branch: "", source: "missing" };
}

function hasAllowBranchLabel(labels) {
  return (labels || []).some((label) => {
    const name = typeof label === "string" ? label : label && label.name;
    return name === "allow-branch";
  });
}

function wrongTargetMessage(base, agreed) {
  return (
    `This PR targets \`${base}\`, but the agreed production branch is \`${agreed}\`. ` +
    `Retarget the PR onto \`${agreed}\`, or add the \`allow-branch\` label if this target is intentional.`
  );
}

function shouldWarnBehind(behind, limit = BEHIND_COMMIT_LIMIT) {
  return Number(behind) > limit;
}

function behindMessage(behind, base, limit = BEHIND_COMMIT_LIMIT) {
  return (
    `This branch is **${behind}** commits behind \`${base}\` (warns above ${limit}). ` +
    `That gap is how a PR picks up the wrong mix of changes. Merge or rebase \`${base}\` before review.`
  );
}

function descriptionTooShort(body, minimum = MIN_DESCRIPTION_LENGTH) {
  return String(body || "").trim().length < minimum;
}

function isLargePr({ lines, files }) {
  return lines > LARGE_PR_LINE_LIMIT || files > LARGE_PR_FILE_LIMIT;
}

function isEnvFile(file) {
  const name = basename(file);
  if (!name.startsWith(".env")) return false;
  if (
    name.endsWith(".example") ||
    name.endsWith(".sample") ||
    name.endsWith(".template") ||
    name.includes(".example.")
  ) {
    return false;
  }
  return true;
}

function isLockfile(file) {
  return LOCKFILES.has(basename(file));
}

function isManifest(file) {
  return MANIFESTS.has(basename(file));
}

function lockfileDrift(files) {
  const locks = (files || []).filter(isLockfile);
  const manifests = (files || []).filter(isManifest);
  return {
    locks,
    manifests,
    warn: locks.length > 0 && manifests.length === 0,
  };
}

function shouldScanForSecrets(file) {
  return !SECRET_SCAN_SKIP.some((pattern) => pattern.test(file));
}

function secretPatterns() {
  return [
    {
      name: "AWS access key id",
      regex: new RegExp("\\bAKIA" + "[0-9A-Z]{16}\\b"),
    },
    {
      name: "private key",
      regex: new RegExp(
        "-{5}BEGIN (?:RSA |OPENSSH |EC |DSA )?PRIVATE KEY-{5}",
      ),
    },
    {
      name: "GitHub token",
      regex: new RegExp("\\bghp_" + "[A-Za-z0-9]{20,}\\b"),
    },
    {
      name: "GitHub fine-grained token",
      regex: new RegExp("\\bgithub_pat_" + "[A-Za-z0-9_]{20,}\\b"),
    },
    {
      name: "Slack token",
      regex: new RegExp("\\bxox[baprs]-" + "[A-Za-z0-9-]{10,}"),
    },
    {
      name: "OpenAI-style key",
      regex: new RegExp("\\bsk-" + "[A-Za-z0-9]{20,}"),
    },
    {
      name: "Paystack secret key",
      regex: new RegExp("\\bsk_" + "(?:live|test)_" + "[A-Za-z0-9]{12,}"),
    },
    {
      name: "assigned secret",
      regex:
        /(?:api[_-]?key|secret|password|access[_-]?token)\s*[:=]\s*['"][^'"\s]{12,}['"]/i,
    },
  ];
}

function findSecrets(addedText) {
  if (!addedText) return [];
  const patterns = secretPatterns();
  const hits = [];
  for (const line of String(addedText).split("\n")) {
    if (!line.trim() || PLACEHOLDER_LINE.test(line)) continue;
    for (const pattern of patterns) {
      if (pattern.regex.test(line)) {
        hits.push(pattern.name);
        break;
      }
    }
  }
  return hits;
}

module.exports = {
  BEHIND_COMMIT_LIMIT,
  LARGE_PR_LINE_LIMIT,
  LARGE_PR_FILE_LIMIT,
  MIN_DESCRIPTION_LENGTH,
  agreedProductionBranch,
  hasAllowBranchLabel,
  wrongTargetMessage,
  shouldWarnBehind,
  behindMessage,
  descriptionTooShort,
  isLargePr,
  isEnvFile,
  isLockfile,
  isManifest,
  lockfileDrift,
  shouldScanForSecrets,
  findSecrets,
};
