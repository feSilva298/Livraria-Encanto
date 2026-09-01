import { FastifyRequest, FastifyReply } from 'fastify'
import { databaseConnect } from '../database/connection'
import { mockDb } from '../database/mockStore'
import { USE_DATABASE } from '../config'
import jwt from 'jsonwebtoken'
import 'dotenv'

type JwtPayLoad = {
  id: number
}

const authUserMiddleware =
  async (req: FastifyRequest, res: FastifyReply) => {
    const { authorization } = req.headers;

    if (!authorization) {
      throw res.status(401).send({ error: 'Não Autorizado!' });;
    }

    const token = authorization.split(' ')[1];

    const { id } = jwt.verify(token, process.env.JWTPASS ?? '') as JwtPayLoad;

    const verifyUser = USE_DATABASE
      ? ((await databaseConnect.query(`SELECT * FROM ${process.env.TABLE2} WHERE id = ?`, [id]))[0] as any)[0]
      : await mockDb.usuarios.findById(id);

    if (!verifyUser) {
      throw new Error('Não Autorizado!');
    }

    const { senha: _, ...userLogged } = verifyUser;

    req.user = userLogged

    return;
  }

export { authUserMiddleware }
