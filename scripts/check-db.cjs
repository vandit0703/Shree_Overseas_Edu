const { loadRootEnv } = require("./load-env.cjs");

Object.assign(process.env, loadRootEnv(process.env));

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is missing. Add it to .env.");
  process.exit(1);
}

const maskedUrl = databaseUrl.replace(/:\/\/([^:]+):([^@]+)@/, "://$1:***@");
console.log(`DATABASE_URL=${maskedUrl}`);

async function main() {
  const pg = require("../lib/db/node_modules/pg");
  const client = new pg.Client({ connectionString: databaseUrl });

  await client.connect();

  const connection = await client.query(
    'select current_database() as db, current_user as "user", inet_server_addr() as host, inet_server_port() as port',
  );
  console.log("Connected:", connection.rows[0]);

  const tables = await client.query(
    "select table_name from information_schema.tables where table_schema = 'public' order by table_name",
  );
  console.log("Tables:", tables.rows.map((row) => row.table_name));

  await client.end();
}

main().catch((error) => {
  console.error("ERROR", error.code || error.name, error.message);
  process.exit(1);
});
