  // routes/adminRoutes.js
// Role: ADMIN can create/update/delete users

import { hashPassword } from "../utils/hash.js";
import { roleGuard } from "../middleware/roleGuard.js";

export default async function adminRoutes(fastify) {
//   const users = fastify.server.mongo.db.collection("users");

  // Create user (Admin only)
  fastify.post("/users", { preHandler: roleGuard("admin") }, async (req, reply) => {
     const users = req.server.mongo.db.collection("users");
    const { email, password } = req.body;
    const hashed = await hashPassword(password);

    const existing = await users.findOne({ email });
    if (existing) return reply.status(400).send({ message: "User already exists" });

    const newUser = await users.insertOne({ email, password: hashed, role: "user" });
    return { message: "User created", userId: newUser.insertedId,newusers:newUser };
  });

  // Get all users (Admin only)
  fastify.get("/users", { preHandler: roleGuard("admin") }, async (req,reply) => {
     const users = req.server.mongo.db.collection("users");
    return users.find().toArray();
  });

  // Update user (Admin only)
  fastify.put("/users/:id", { preHandler: roleGuard("admin") }, async (req, reply) => {
     const users = req.server.mongo.db.collection("users");
    const { password, ...rest } = req.body;
    if (password) rest.password = await hashPassword(password);

    const updated = await users.findOneAndUpdate(
      { _id: new fastify.mongo.ObjectId(req.params.id) },
      { $set: rest },
      { returnDocument: "after" }
    );

    return { message: "User updated", user: updated.value };
  });

  // Delete user (Admin only)
  fastify.delete("/users/:id", { preHandler: roleGuard("admin") }, async (req, reply) => {
     const users = req.server.mongo.db.collection("users");
    await users.deleteOne({ _id: new fastify.mongo.ObjectId(req.params.id) });
    return { message: "User deleted" };
  });
}
