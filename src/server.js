import Fastify from "fastify";

const fastify = Fastify({ logger: true });

fastify.get("/", async (request, reply) => {
  return reply.status(200).send({ status: "OK" });
});

try {
  await fastify.listen({ port: 3000 });
} catch (error) {
  fastify.log.error(error);
  process.exit(1);
}
