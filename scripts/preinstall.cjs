const fs = require("node:fs");
const path = require("node:path");

const userAgent = (process.env.npm_config_user_agent || "").toLowerCase();
const execPath = (process.env.npm_execpath || "").toLowerCase();

const isPnpm =
  userAgent.startsWith("pnpm/") || /[\\/]pnpm(?:\.c?js)?$/i.test(execPath);
const isKnownWrongManager =
  userAgent.startsWith("npm/") ||
  userAgent.startsWith("yarn/") ||
  /[\\/](?:npm-cli|yarn)(?:\.c?js)?$/i.test(execPath);

if (!isPnpm && isKnownWrongManager) {
  console.error("Use pnpm instead of npm or yarn.");
  process.exit(1);
}

for (const file of ["package-lock.json", "yarn.lock"]) {
  const target = path.resolve(__dirname, "..", file);
  if (fs.existsSync(target)) {
    fs.rmSync(target, { force: true });
  }
}
