 // routes/authRoutes.js
import { comparePassword } from "../utils/hash.js";

export default async function authRoutes(fastify) {
  // Schema for login request
  const loginSchema = {
    body: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: { type: "string", format: "email" },
        password: { type: "string", minLength: 6 },
      },
    },
  };

  // User login
  fastify.post("/login", { schema: loginSchema }, async (req, reply) => {
    const { email, password } = req.body;

    const user = await req.server.mongo.db.collection("users").findOne({ email });
    if (!user) return reply.status(400).send({ message: "Invalid credentials" });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return reply.status(400).send({ message: "Invalid credentials" });

    const token = fastify.jwt.sign({ id: user._id, role: user.role });
    return { token };
  });
}
