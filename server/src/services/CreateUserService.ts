import { databaseConnect } from "../database/connection";
import { mockDb } from "../database/mockStore";
import { USE_DATABASE } from "../config";
import 'dotenv'

interface CreateUserProps{
  nome: string,
  email: string,
  senha: string
}

class CreateUserService{
  async execute({ nome, email, senha}: CreateUserProps){
    console.log("Rota de Criação de Usuário executada!");

    try {
      if (!USE_DATABASE) {
        const usuario = await mockDb.usuarios.create({ nome, email, senha });
        return { id: usuario.id, nome, email };
      }

      const [result] = await databaseConnect.query(`INSERT INTO ${process.env.TABLE2} (nome, email, senha) VALUES (?, ?, ?);`, [nome, email, senha] );

      const referenceId = (result as any).referenceId;

      console.log(result)
      return{ id: referenceId, nome, email};

    } catch (err: any) {

      console.error(err);
      throw err;

    }
    
  }
}

export { CreateUserService }
