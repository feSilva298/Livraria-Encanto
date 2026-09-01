import { databaseConnect } from "../database/connection";
import { mockDb } from "../database/mockStore";
import { USE_DATABASE } from "../config";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv'

interface AuthPublisherProps{
  CNPJ: string,
  email: string,
  senha: string
}

class AuthPublisherService{
  async execute({ CNPJ, email, senha}: AuthPublisherProps){
    const verifyPublisherEmail = USE_DATABASE
      ? ((await databaseConnect.query(`SELECT * FROM ${process.env.TABLE5} WHERE email = ?`, [email]))[0] as any)[0]
      : await mockDb.editoras.findByEmail(email);

    if(!verifyPublisherEmail){
      throw new Error("Cnpj, email ou senha inválidos!");
    }

    const verifyPublisher = USE_DATABASE
      ? ((await databaseConnect.query(`SELECT * FROM ${process.env.TABLE5} WHERE CNPJ = ?`, [CNPJ]))[0] as any)[0]
      : await mockDb.editoras.findByCnpj(CNPJ);

    if(!verifyPublisher){
      throw new Error("Cnpj, email ou senha inválidos!");
    }


    const verifyPass = await bcrypt.compare(senha, verifyPublisher.senha);

    if (!verifyPass) {
      throw new Error("Cnpj, email ou senha inválidos!");
    }

    const token = jwt.sign({ id: verifyPublisher.id }, process.env.JWTPASS ?? '', { expiresIn: '3d' });

    const {senha: _, ...publisherLogin} = verifyPublisher
    
    console.log({publisherLogin: publisherLogin, token: token});
    return { publisher: publisherLogin, token: token };
  }
}

export { AuthPublisherService }
