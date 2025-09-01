// middlewares/authGuard.js
// Verifies JWT for all protected routes

export async function authGuard(req, reply) {
  try {
    await req.jwtVerify(); // verify token
    return reply.send({message:"verification successfully.."})
  } catch (err) {
    return reply.status(401).send({ message: "Unauthorized" });
  }
}
