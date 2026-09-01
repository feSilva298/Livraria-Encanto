import { databaseConnect } from "../database/connection";
import { mockDb } from "../database/mockStore";
import { USE_DATABASE } from "../config";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv'

interface AuthUserProps{
  email: string,
  senha: string
}

class AuthUserService{
  async execute({ email, senha}: AuthUserProps){
    const verifyUser = USE_DATABASE
      ? ((await databaseConnect.query(`SELECT * FROM ${process.env.TABLE2} WHERE email = ?`, [email]))[0] as any)[0]
      : await mockDb.usuarios.findByEmail(email);

    if(!verifyUser){
      throw new Error("Email ou senha inválidos!");
    }

    const verifyPass = await bcrypt.compare(senha, verifyUser.senha);

    if (!verifyPass) {
      throw new Error("Email ou senha inválidos!");
    }

    const token = jwt.sign({ id: verifyUser.id }, process.env.JWTPASS ?? '', { expiresIn: '3d' });

    const {senha: _, ...userLogin} = verifyUser
    
    console.log({userLogin: userLogin, token: token});
    return { user: userLogin, token: token };
  }
}

export { AuthUserService }
