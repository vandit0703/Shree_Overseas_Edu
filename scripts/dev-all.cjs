const { spawn } = require("node:child_process");
const { loadRootEnv } = require("./load-env.cjs");

const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const spawnCommand = process.platform === "win32" ? (process.env.ComSpec || "cmd.exe") : pnpm;
const env = loadRootEnv(process.env);

const processes = [
  {
    name: "api",
    args: ["--filter", "@workspace/api-server", "run", "dev"],
  },
  {
    name: "web",
    args: ["--filter", "@workspace/shree-overseas", "run", "dev"],
  },
];

let shuttingDown = false;
const children = processes.map(({ name, args }) => {
  const spawnArgs = process.platform === "win32" ? ["/d", "/s", "/c", pnpm, ...args] : args;
  const child = spawn(spawnCommand, spawnArgs, {
    stdio: "inherit",
    shell: false,
    env,
  });

  child.on("exit", (code, signal) => {
    if (shuttingDown) return;
    shuttingDown = true;

    if (signal) {
      console.error(`${name} stopped with signal ${signal}`);
    } else if (code !== 0) {
      console.error(`${name} exited with code ${code}`);
    }

    for (const other of children) {
      if (other !== child && !other.killed) {
        other.kill();
      }
    }

    process.exit(code ?? 1);
  });

  child.on("error", (error) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.error(`${name}: ${error.message}`);
    process.exit(1);
  });

  return child;
});

function stopAll() {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) child.kill();
  }
}

process.on("SIGINT", stopAll);
process.on("SIGTERM", stopAll);
