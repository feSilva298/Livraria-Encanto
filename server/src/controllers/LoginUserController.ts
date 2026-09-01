import { FastifyRequest, FastifyReply } from 'fastify'
import 'dotenv'

class LoginUserController {
  async handle(req: FastifyRequest, res: FastifyReply) {
    if (req.user) {
      return res.send(req.user);
    } else {
      return res.status(401).send({ error: 'Não Autorizado!' });
    }
  }
}

export { LoginUserController }