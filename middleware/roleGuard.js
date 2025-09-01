 // middlewares/roleGuard.js
// Restricts route access to specific roles (e.g. admin)

export function roleGuard(role) {
  return async function (req, reply) {
    try {
      await req.jwtVerify();
      if (req.user.role !== role) {
        return reply.status(403).send({ message: "Forbidden: Only Admin can perform this action" });
      }
    } catch (err) {
      return reply.status(401).send({ message: "Unauthorized" });
    }
  };
}
