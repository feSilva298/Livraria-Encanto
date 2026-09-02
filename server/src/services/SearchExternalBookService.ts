interface OpenLibraryDoc {
  key?: string;
  title?: string;
  author_name?: string[];
  publisher?: string[];
  first_publish_year?: number;
  number_of_pages_median?: number;
  isbn?: string[];
  cover_i?: number;
  subject?: string[];
}

class SearchExternalBookService {
  async execute(search: string) {
    const url =
      `https://openlibrary.org/search.json?q=${encodeURIComponent(search)}` +
      `&limit=10&fields=key,title,author_name,publisher,first_publish_year,number_of_pages_median,isbn,cover_i,subject`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Erro ao consultar a Open Library");
    }

    const data = await response.json() as {
      docs?: OpenLibraryDoc[];
    };

    return (data.docs ?? []).map((book) => ({
      titulo: book.title ?? "",
      autor: book.author_name?.[0] ?? "",
      editora: book.publisher?.[0] ?? "",
      ano_pub: book.first_publish_year ?? 0,
      paginas: book.number_of_pages_median ?? 0,
      isbn: book.isbn?.[0] ?? "",
      imagem: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
        : null,
    }));
  }
}

export { SearchExternalBookService };