import { databaseConnect } from "../database/connection";
import { mockDb } from "../database/mockStore";
import { USE_DATABASE } from "../config";
import 'dotenv'

interface CreatePublisherProps{
  CNPJ: string;
  nome: string,
  email: string,
  senha: string
}
class CreatePublisherService{

  async execute({ CNPJ, nome, email, senha}: CreatePublisherProps){
    console.log("Rota de Criação de Editora executada!");

    try {
      if (!USE_DATABASE) {
        await mockDb.editoras.create({ CNPJ, nome, email, senha });
        return { CNPJ, nome, email };
      }

      const [result] = await databaseConnect.query(`INSERT INTO ${process.env.TABLE5} (CNPJ, nome, email, senha) VALUES (?, ?, ?, ?);`, [CNPJ, nome, email, senha] );

      console.log(result)
      return{ CNPJ, nome, email};

    } catch (err: any) {

      console.error(err);
      throw err;

    }
    
  }
}

export { CreatePublisherService }
