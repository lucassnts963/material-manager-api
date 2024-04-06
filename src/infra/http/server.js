import { config } from "dotenv";
import { expand } from "dotenv-expand";
import Fastify from "fastify";

import { statusRoutes } from "./routes/v1/status.js";

expand(config());

const fastify = Fastify({ logger: true });

fastify.register(statusRoutes);

fastify.get("/", async (request, reply) => {
  return reply.status(200).send({ status: "OK" });
});

async function start() {
  try {
    fastify.listen({ port: process.env.PORT || 3000 });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}

export default {
  start,
};
