import { FastifyRequest, FastifyReply } from 'fastify'
import { databaseConnect } from '../database/connection'
import { mockDb } from '../database/mockStore'
import { USE_DATABASE } from '../config'
import jwt from 'jsonwebtoken'
import 'dotenv'

type JwtPayLoad = {
  id: number
}

const authPublisherMiddleware =
  async (req: FastifyRequest, res: FastifyReply) => {
    const { authorization } = req.headers;

    if (!authorization) {
      throw res.status(401).send({ error: 'Não Autorizado!' });;
    }

    const token = authorization.split(' ')[1];

    const { id } = jwt.verify(token, process.env.JWTPASS ?? '') as JwtPayLoad;

    const verifyPublisher = USE_DATABASE
      ? ((await databaseConnect.query(`SELECT * FROM ${process.env.TABLE5} WHERE id = ?`, [id]))[0] as any)[0]
      : await mockDb.editoras.findById(id);

    if (!verifyPublisher) {
      throw new Error('Não Autorizado!');
    }

    const { senha: _, ...publisherLogged } = verifyPublisher;

    req.publisher = publisherLogged

    return;
  }

export { authPublisherMiddleware }
