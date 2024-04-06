import database from "../../../database.js";

export async function statusRoutes(fastify, options) {
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
}
