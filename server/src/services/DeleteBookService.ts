import { databaseConnect } from "../database/connection"
import { mockDb } from "../database/mockStore";
import { USE_DATABASE } from "../config";
import 'dotenv'

interface DeleteBookProps{
  id: number
}

class DeleteBookService{
  async execute({ id }: DeleteBookProps){

    if (!id) {
      throw new Error("Ação Inválida")
    }

    if (!USE_DATABASE) {
      const removido = await mockDb.livros.remove(id);
      if (!removido) {
        throw new Error("Identificador de deleção não encontrado")
      }
      console.log("Alvo deletado");
      return;
    }
    
    const deleteId = await databaseConnect.query(`DELETE FROM ${process.env.TABLE1} WHERE id = ?`,
    [id]
    );

    console.log(deleteId);

    if (!deleteId) {
      throw new Error("Identificador de deleção não encontrado")
    } else{
      console.log("Alvo deletado")
    }

  }
}

export{ DeleteBookService }
