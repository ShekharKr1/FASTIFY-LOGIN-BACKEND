  // seedAdmin.js
import dotenv from "dotenv";
import Fastify from "fastify";
import  dbConnector  from "./config/db.js";
import { hashPassword } from "./utils/hash.js";

dotenv.config();

async function seedAdmin() {
  const fastify = Fastify();
  await fastify.register(dbConnector);

  const users = fastify.server.mongo.db.collection("users");

  const existingAdmin = await users.findOne({ role: "admin" });
  if (existingAdmin) {
    console.log("⚠️ Admin already exists:", existingAdmin.email);
    process.exit();
  }

  const hashed = await hashPassword("admin123");

  await users.insertOne({
    email: "admin@example.com",
    password: hashed,
    role: "admin",
  });

  console.log("✅ Admin seeded: admin@example.com / admin123");
  process.exit();
}

seedAdmin();
