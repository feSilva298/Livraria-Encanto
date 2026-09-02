import { FastifyRequest, FastifyReply } from "fastify";
import { SearchExternalBookService } from "../services/SearchExternalBookService";

interface SearchExternalBookQuery {
  search: string;
}

class SearchExternalBookController {
  async handle(req: FastifyRequest, res: FastifyReply) {
    const { search } = req.query as SearchExternalBookQuery;

    if (!search || search.trim().length < 2) {
      return res.status(400).send({
        error: "Informe pelo menos 2 caracteres para pesquisar.",
      });
    }

    try {
      const service = new SearchExternalBookService();
      const books = await service.execute(search.trim());

      return res.status(200).send(books);
    } catch (error) {
      console.error("Erro ao buscar livros externos:", error);

      return res.status(500).send({
        error: "Erro ao consultar a API de livros.",
      });
    }
  }
}

export { SearchExternalBookController };