import { useState, useRef, FormEvent, useEffect } from "react";
import { api } from "../service/api";
import { publisherAuth } from "../hooks/PublisherAuthHook";

interface ExternalBook {
  titulo: string;
  autor: string;
  editora: string;
  ano_pub: number;
  paginas: number;
  isbn: string;
  imagem: string | null;
}

function CreateBookForm() {
  const publisherData = publisherAuth();

  const tituloRef = useRef<HTMLInputElement | null>(null);
  const descricaoRef = useRef<HTMLInputElement | null>(null);
  const autorRef = useRef<HTMLInputElement | null>(null);
  const categoriaRef = useRef<HTMLSelectElement | null>(null);
  const classificacaoRef = useRef<HTMLSelectElement | null>(null);
  const paginasRef = useRef<HTMLInputElement | null>(null);
  const editoraRef = useRef<HTMLInputElement | null>(null);
  const anoPubRef = useRef<HTMLInputElement | null>(null);
  const precoRef = useRef<HTMLInputElement | null>(null);
  const imageRef = useRef<HTMLInputElement | null>(null);

  const [bookId, setBookId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showImageForm, setShowImageForm] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [precoError, setPrecoError] = useState("");

  // Busca externa de livros
  const [externalSearch, setExternalSearch] = useState("");
  const [externalBooks, setExternalBooks] = useState<ExternalBook[]>([]);
  const [searchingExternal, setSearchingExternal] = useState(false);
  const [selectedCover, setSelectedCover] = useState<string | null>(null);

  // ============================================================
  // BUSCAR LIVROS NA API EXTERNA
  // ============================================================

  const searchExternalBooks = async () => {
    if (externalSearch.trim().length < 2) {
      setError("Digite pelo menos 2 caracteres para pesquisar.");
      setSuccessMessage("");
      return;
    }

    try {
      setSearchingExternal(true);
      setError("");
      setSuccessMessage("");

      const res = await api.get(
        `/external-books?search=${encodeURIComponent(
          externalSearch.trim()
        )}`
      );

      setExternalBooks(res.data);

      if (!res.data || res.data.length === 0) {
        setSuccessMessage("Nenhum livro encontrado.");
      }
    } catch (error) {
      console.error("Erro ao pesquisar livros:", error);
      setError("Não foi possível pesquisar os livros.");
      setExternalBooks([]);
    } finally {
      setSearchingExternal(false);
    }
  };

  // ============================================================
  // SELECIONAR LIVRO ENCONTRADO NA API
  // ============================================================

  const selectExternalBook = (book: ExternalBook) => {
    if (tituloRef.current) {
      tituloRef.current.value = book.titulo;
    }

    if (autorRef.current) {
      autorRef.current.value = book.autor;
    }

    if (paginasRef.current) {
      paginasRef.current.value = book.paginas
        ? String(book.paginas)
        : "";
    }

    if (anoPubRef.current) {
      anoPubRef.current.value = book.ano_pub
        ? String(book.ano_pub)
        : "";
    }

    // A editora NÃO é alterada.
    // Ela continua sendo a editora logada no sistema.

    if (descricaoRef.current) {
      descricaoRef.current.value = book.titulo
        ? `Livro "${book.titulo}"${
            book.autor ? ` de ${book.autor}` : ""
          }.`
        : "";
    }

    // Guarda a capa encontrada para mostrar uma prévia.
    // O upload oficial da capa continua sendo feito
    // pelo sistema atual depois do cadastro.
    setSelectedCover(book.imagem);

    setExternalBooks([]);
    setExternalSearch("");

    setSuccessMessage(
      "Informações encontradas! Confira os dados antes de cadastrar."
    );
    setError("");
  };

  // ============================================================
  // VALIDAÇÃO DO PREÇO
  // ============================================================

  const handlePrecoChange = () => {
    if (precoRef.current) {
      const value = precoRef.current.value;

      if (!/^\d*\.?\d*$/.test(value)) {
        setPrecoError(
          'Valor inválido. Apenas números e o caractere "." são permitidos.'
        );
      } else if (parseFloat(value) < 0) {
        setPrecoError("O valor não pode ser abaixo de 0.");
      } else {
        setPrecoError("");
      }
    }
  };

  // ============================================================
  // REDIRECIONAMENTO APÓS UPLOAD
  // ============================================================

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (redirecting) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            window.location.href = "/publisher-profile";
            return 0;
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [redirecting]);

  // ============================================================
  // CADASTRAR LIVRO
  // ============================================================

  const handleBookSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const titulo = tituloRef.current?.value || "";
    const descricao = descricaoRef.current?.value || "";
    const autor = autorRef.current?.value || "";
    const categoria = categoriaRef.current?.value || "";
    const classificacao = classificacaoRef.current?.value || "";
    const paginas = parseInt(
      paginasRef.current?.value || "0",
      10
    );
    const editora = editoraRef.current?.value || "";
    const ano_pub = parseInt(
      anoPubRef.current?.value || "0",
      10
    );
    const preco = parseFloat(
      precoRef.current?.value || "0"
    );

    if (preco < 0) {
      setPrecoError("O valor não pode ser abaixo de 0.");
      return;
    }

    try {
      const res = await api.post("/insert-book", {
        titulo,
        descricao,
        autor,
        categoria,
        classificacao,
        paginas,
        editora,
        ano_pub,
        preco,
      });

      setBookId(res.data.id);

      setSuccessMessage(
        "Livro criado com sucesso! Agora faça o upload da imagem."
      );

      setError("");
      setShowImageForm(true);
    } catch (err) {
      console.error("Erro ao criar o livro:", err);
      setError("Erro ao criar o livro.");
      setSuccessMessage("");
    }
  };

  // ============================================================
  // UPLOAD DA IMAGEM
  // ============================================================

  const handleImageSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!bookId || !imageRef.current?.files?.[0]) {
      setError("ID do livro ou imagem ausente.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append(
        "image",
        imageRef.current.files[0]
      );

      await api.post(
        `/upload-book-image/${bookId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccessMessage("Imagem enviada com sucesso!");
      setError("");
      setRedirecting(true);
    } catch (err) {
      console.error("Erro ao enviar a imagem:", err);
      setError("Erro ao enviar a imagem.");
    }
  };

  // ============================================================
  // PREVIEW DA IMAGEM ESCOLHIDA PELO USUÁRIO
  // ============================================================

  const handleImageChange = () => {
    if (imageRef.current?.files?.[0]) {
      const file = imageRef.current.files[0];

      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">

        {error && (
          <p className="text-red-500 mb-4">
            {error}
          </p>
        )}

        {precoError && (
          <p className="text-red-500 mb-4">
            {precoError}
          </p>
        )}

        {successMessage && (
          <p className="text-green-500 mb-4">
            {successMessage}
          </p>
        )}

        {/* ======================================================
            FORMULÁRIO DE CADASTRO
        ======================================================= */}

        {!showImageForm && (
          <div>

            {/* ==================================================
                BUSCA DE LIVROS NA API
            =================================================== */}

            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Buscar livro
              </h2>

              <p className="text-sm text-gray-600 mb-3">
                Pesquise pelo título ou autor para preencher
                automaticamente os dados do livro.
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={externalSearch}
                  onChange={(e) =>
                    setExternalSearch(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      searchExternalBooks();
                    }
                  }}
                  placeholder="Ex: Harry Potter, O Hobbit..."
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                />

                <button
                  type="button"
                  onClick={searchExternalBooks}
                  disabled={searchingExternal}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {searchingExternal
                    ? "Buscando..."
                    : "Buscar"}
                </button>
              </div>

              {/* ================================================
                  RESULTADOS DA API
              ================================================= */}

              {externalBooks.length > 0 && (
                <div className="mt-4 space-y-3">
                  {externalBooks.map((book, index) => (
                    <div
                      key={`${book.isbn || book.titulo}-${index}`}
                      className="bg-white border border-gray-200 rounded-lg p-3 flex gap-4 items-center"
                    >

                      {/* CAPA */}

                      {book.imagem ? (
                        <img
                          src={book.imagem}
                          alt={`Capa de ${book.titulo}`}
                          className="w-16 h-24 object-cover rounded shadow-sm"
                        />
                      ) : (
                        <div className="w-16 h-24 bg-gray-200 rounded flex items-center justify-center text-xs text-center text-gray-500">
                          Sem capa
                        </div>
                      )}

                      {/* INFORMAÇÕES */}

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">
                          {book.titulo}
                        </h3>

                        <p className="text-sm text-gray-600">
                          {book.autor ||
                            "Autor desconhecido"}
                        </p>

                        {book.ano_pub > 0 && (
                          <p className="text-sm text-gray-500">
                            {book.ano_pub}
                          </p>
                        )}

                        {book.paginas > 0 && (
                          <p className="text-sm text-gray-500">
                            {book.paginas} páginas
                          </p>
                        )}
                      </div>

                      {/* BOTÃO USAR */}

                      <button
                        type="button"
                        onClick={() =>
                          selectExternalBook(book)
                        }
                        className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Usar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ==================================================
                FORMULÁRIO ORIGINAL DO LIVRO
            =================================================== */}

            <form
              onSubmit={handleBookSubmit}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* TÍTULO */}

                <div>
                  <label className="block text-gray-700">
                    Título
                  </label>

                  <input
                    type="text"
                    placeholder="Título"
                    ref={tituloRef}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                {/* DESCRIÇÃO */}

                <div>
                  <label className="block text-gray-700">
                    Descrição
                  </label>

                  <input
                    type="text"
                    placeholder="Descrição"
                    ref={descricaoRef}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                {/* AUTOR */}

                <div>
                  <label className="block text-gray-700">
                    Autor
                  </label>

                  <input
                    type="text"
                    placeholder="Autor"
                    ref={autorRef}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                {/* CATEGORIA */}

                <div>
                  <label className="block text-gray-700">
                    Categoria
                  </label>

                  <select
                    ref={categoriaRef}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">
                      Selecione a Categoria
                    </option>

                    <option value="Ação">
                      Ação
                    </option>

                    <option value="Aventura">
                      Aventura
                    </option>

                    <option value="Biografia">
                      Biografia
                    </option>

                    <option value="Drama">
                      Drama
                    </option>

                    <option value="Esportivo">
                      Esportivo
                    </option>

                    <option value="Fantasia">
                      Fantasia
                    </option>

                    <option value="Ficção">
                      Ficção
                    </option>

                    <option value="Gibi">
                      Gibi
                    </option>

                    <option value="Infantil">
                      Infantil
                    </option>

                    <option value="Mistério">
                      Mistério
                    </option>

                    <option value="Terror">
                      Terror
                    </option>
                  </select>
                </div>

                {/* CLASSIFICAÇÃO */}

                <div>
                  <label className="block text-gray-700">
                    Classificação
                  </label>

                  <select
                    ref={classificacaoRef}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">
                      Selecione a Classificação Indicatica
                    </option>

                    <option value="L">
                      Livre
                    </option>

                    <option value="10">
                      10+
                    </option>

                    <option value="12">
                      12+
                    </option>

                    <option value="14">
                      14+
                    </option>

                    <option value="16">
                      16+
                    </option>

                    <option value="18">
                      18+
                    </option>
                  </select>
                </div>

                {/* PÁGINAS */}

                <div>
                  <label className="block text-gray-700">
                    Páginas
                  </label>

                  <input
                    type="number"
                    placeholder="Páginas"
                    ref={paginasRef}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                {/* EDITORA */}

                <div>
                  <label className="block text-gray-700">
                    Editora
                  </label>

                  <input
                    type="text"
                    disabled
                    value={
                      publisherData
                        ? publisherData.nome
                        : "Carregando..."
                    }
                    ref={editoraRef}
                    className="w-full p-2 border border-gray-300 rounded-md cursor-not-allowed"
                  />
                </div>

                {/* ANO */}

                <div>
                  <label className="block text-gray-700">
                    Ano de Publicação
                  </label>

                  <input
                    type="number"
                    placeholder="Ano de Publicação"
                    ref={anoPubRef}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                {/* PREÇO */}

                <div>
                  <label className="block text-gray-700">
                    Preço
                  </label>

                  <input
                    type="text"
                    placeholder="Preço"
                    ref={precoRef}
                    onChange={handlePrecoChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* PREVIEW DA CAPA DA API */}

              {selectedCover && (
                <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-gray-700 font-medium mb-3">
                    Capa encontrada
                  </p>

                  <div className="flex items-center gap-4">
                    <img
                      src={selectedCover}
                      alt="Capa encontrada na API"
                      className="w-24 h-36 object-cover rounded shadow-md"
                    />

                    <p className="text-sm text-gray-600">
                      A capa foi encontrada automaticamente.
                      <br />
                      Depois de cadastrar o livro, envie a
                      imagem usando o upload abaixo.
                    </p>
                  </div>
                </div>
              )}

              {/* BOTÃO CADASTRAR */}

              <button
                type="submit"
                className="w-full p-2 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Enviar Informações
              </button>
            </form>
          </div>
        )}

        {/* ======================================================
            FORMULÁRIO DE UPLOAD DA IMAGEM
        ======================================================= */}

        {showImageForm && (
          <div>
            {selectedCover && !imagePreview && (
              <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-gray-700 font-medium mb-3">
                  Capa encontrada pela API
                </p>

                <img
                  src={selectedCover}
                  alt="Capa encontrada na API"
                  className="w-32 h-48 object-cover rounded-md shadow-md"
                />

                <p className="text-sm text-gray-600 mt-3">
                  Você pode baixar essa capa e selecioná-la
                  no campo abaixo.
                </p>
              </div>
            )}

            <form
              onSubmit={handleImageSubmit}
              className="mt-6 flex items-center space-x-4"
            >
              {imagePreview && (
                <div className="flex items-center space-x-4">
                  <img
                    src={imagePreview}
                    alt="Preview da Imagem"
                    className="w-32 h-auto border border-gray-300 rounded-md"
                  />
                </div>
              )}

              <div className="flex-1">
                <label className="block text-gray-700">
                  Imagem
                </label>

                <input
                  type="file"
                  ref={imageRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <button
                type="submit"
                className="p-2 mt-4 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Enviar Imagem
              </button>
            </form>
          </div>
        )}

        {/* ======================================================
            REDIRECIONAMENTO
        ======================================================= */}

        {redirecting && (
          <div className="mt-6 text-center">
            <p>
              Redirecionando em {secondsLeft} segundos...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateBookForm;

