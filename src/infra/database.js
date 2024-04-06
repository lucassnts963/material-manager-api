import pg from "pg";

const { Client } = pg;

async function query(objectQuery) {
  let client;

  try {
    client = getNewClient();

    const result = await client.query(objectQuery);

    return result;
  } catch (error) {
    console.error(error);
  } finally {
    await client.end();
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  });
  await client.connect();

  return client;
}

export default {
  query,
  getNewClient,
};
