import { databaseConnect } from "../database/connection";
import { mockDb } from "../database/mockStore";
import { USE_DATABASE } from "../config";
import 'dotenv'

class ListBookService{

  async execute(){
    
    try {
      if (!USE_DATABASE) {
        return mockDb.livros.listAll();
      }

      const [query] = await databaseConnect.query(`SELECT * FROM ${process.env.TABLE1};`);
      console.log("Consulta Executada");
      return query;
    
    } catch (error) {
      
      console.error(error);
      throw error;
      
    }

  }

  async executeSearch(searchTerm: string){
    try {
      if (!USE_DATABASE) {
        return mockDb.livros.search(searchTerm);
      }

      const query = `
        SELECT * FROM ${process.env.TABLE1}
        WHERE titulo LIKE ? OR autor LIKE ? OR categoria LIKE ?;
      `;
      const [results] = await databaseConnect.query(query, [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]);

      console.log("Consulta de pesquisa executada");
      return results;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export { ListBookService }
