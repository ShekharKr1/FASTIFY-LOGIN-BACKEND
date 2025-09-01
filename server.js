   // server.js
import Fastify from "fastify";
import dotenv from "dotenv";
import fastifyJwt from "@fastify/jwt";
import dbConnector from "./config/db.js";  
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const fastify = Fastify({ logger: true });

// Register plugins
await fastify.register(dbConnector);
// Register MongoDB plugin
// await fastify.register(fastifyMongo, {
//   forceClose: true,
//   url: process.env.MONGO_URI,   // e.g. mongodb://127.0.0.1:27017/mydb
// });
await fastify.register(fastifyJwt, { secret: process.env.JWT_SECRET });

// Routes
// Register routes with prefixes:
// - authRoutes endpoints will be under: /api/auth/*
//    -> /api/auth/login
// - adminRoutes endpoints will be under: /api/admin/*
//    -> /api/admin/users
await fastify.register(authRoutes, { prefix: "/api/auth" });
await fastify.register(adminRoutes, { prefix: "/api/admin" });

const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT });
    console.log(`🚀 Server running on port ${process.env.PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
