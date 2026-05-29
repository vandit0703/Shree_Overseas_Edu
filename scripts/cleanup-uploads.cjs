const fs = require("node:fs/promises");
const path = require("node:path");
const { loadRootEnv } = require("./load-env.cjs");

Object.assign(process.env, loadRootEnv(process.env));

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is missing. Add it to .env.");
  process.exit(1);
}

const uploadUrlPrefix = "/api/uploads/";
const uploadDir = path.resolve(__dirname, "..", "artifacts", "api-server", "uploads");

const mediaColumns = [
  ["gallery_items", "url"],
  ["videos", "url"],
  ["videos", "thumbnail"],
  ["team_members", "photo"],
  ["success_stories", "photo"],
  ["success_stories", "video_url"],
  ["testimonials", "photo"],
  ["destinations", "image"],
  ["destinations", "flag"],
  ["universities", "logo"],
];

function getUploadFilename(url) {
  if (!url || typeof url !== "string") return null;

  let pathname = null;
  if (url.startsWith(uploadUrlPrefix)) {
    pathname = url;
  } else {
    try {
      pathname = new URL(url).pathname;
    } catch {
      return null;
    }
  }

  if (!pathname.startsWith(uploadUrlPrefix)) return null;
  return path.basename(decodeURIComponent(pathname.slice(uploadUrlPrefix.length)));
}

async function main() {
  const pg = require("../lib/db/node_modules/pg");
  const client = new pg.Client({ connectionString: databaseUrl });
  await client.connect();

  const referenced = new Set();

  for (const [table, column] of mediaColumns) {
    const result = await client.query(`select ${column} as url from ${table} where ${column} is not null`);
    for (const row of result.rows) {
      const filename = getUploadFilename(row.url);
      if (filename) referenced.add(filename);
    }
  }

  await client.end();

  await fs.mkdir(uploadDir, { recursive: true });
  const entries = await fs.readdir(uploadDir, { withFileTypes: true });
  let removed = 0;

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (referenced.has(entry.name)) continue;

    await fs.unlink(path.join(uploadDir, entry.name));
    removed += 1;
    console.log(`Removed orphan upload: ${entry.name}`);
  }

  console.log(`Done. Removed ${removed} orphan upload file(s).`);
}

main().catch((error) => {
  console.error("ERROR", error.code || error.name, error.message);
  process.exit(1);
});
