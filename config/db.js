// config/db.js
// CHANGED: export default fastify-plugin style so registration is proper
import fp from "fastify-plugin";
import fastifyMongo from "@fastify/mongodb";

export default fp(async function (fastify, opts) {
  await fastify.register(fastifyMongo, {
    forceClose: true,
    url: process.env.MONGO_URI,
  });
});
