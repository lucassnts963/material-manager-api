import { config } from "dotenv";
import { expand } from "dotenv-expand";
import Fastify from "fastify";
import database from "../database.js";

expand(config());

const fastify = Fastify({ logger: true });

fastify.get("/", async (request, reply) => {
  return reply.status(200).send({ status: "OK" });
});

fastify.get("/v1/status", async (request, reply) => {
  const updateAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaxConnectionsValue =
    databaseMaxConnectionsResult.rows[0].max_connections;

  const databaseOpenedConnectionsResult = await database.query({
    text: "SELECT count(*)::int as opened_connections FROM pg_stat_database WHERE datname = $1",
    values: [process.env.POSTGRES_DB],
  });

  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].opened_connections;

  return reply.status(200).send({
    update_at: updateAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConnectionsValue),
        opened_connections: databaseOpenedConnectionsValue,
      },
    },
  });
});

async function start() {
  try {
    await fastify.listen({ port: process.env.PORT || 3000 });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}

export default {
  start,
};
