const { spawn } = require("node:child_process");
const { loadRootEnv } = require("./load-env.cjs");

const separatorIndex = process.argv.indexOf("--");

if (separatorIndex === -1 || separatorIndex === process.argv.length - 1) {
  console.error("Usage: node scripts/with-env.cjs KEY=value -- command [args...]");
  process.exit(1);
}

const env = loadRootEnv(process.env);

for (const pair of process.argv.slice(2, separatorIndex)) {
  const equalsIndex = pair.indexOf("=");
  if (equalsIndex <= 0) {
    console.error(`Invalid env assignment: ${pair}`);
    process.exit(1);
  }

  env[pair.slice(0, equalsIndex)] = pair.slice(equalsIndex + 1);
}

const [rawCommand, ...args] = process.argv.slice(separatorIndex + 1);
const command =
  process.platform === "win32" && !/\.(?:cmd|bat|exe)$/i.test(rawCommand)
    ? `${rawCommand}.cmd`
    : rawCommand;
const spawnCommand = process.platform === "win32" ? (process.env.ComSpec || "cmd.exe") : command;
const spawnArgs = process.platform === "win32" ? ["/d", "/s", "/c", command, ...args] : args;

const child = spawn(spawnCommand, spawnArgs, {
  env,
  stdio: "inherit",
  shell: false,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

child.on("error", (error) => {
  console.error(error.message);
  process.exit(1);
});
