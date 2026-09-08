
import { useState, useEffect } from "react";
import { api } from "../service/api";
import Header from "../components/HeaderGeneral";
import Footer from "../components/Footer";
import "../index.css";
import { useNavigate } from "react-router-dom";

interface BookProps {
  id: number;
  titulo: string;
  autor: string;
  categoria: string;
  editora: string;
  imagem: string;
}

function HomePage() {
  const [displayedItems, setDisplayedItems] = useState<BookProps[]>([]);
  const [sportsBooks, setSportsBooks] = useState<BookProps[]>([]);
  const [mysteryBooks, setMysteryBooks] = useState<BookProps[]>([]);
  const [kidsBooks, setKidsBooks] = useState<BookProps[]>([]);
  const [scienceFictionBooks, setScienceFictionBooks] = useState<BookProps[]>([]);
  const [romanceBooks, setRomanceBooks] = useState<BookProps[]>([]);
  const [biographyBooks, setBiographyBooks] = useState<BookProps[]>([]);
  const [selfHelpBooks, setSelfHelpBooks] = useState<BookProps[]>([]);

  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    loadBooks();
  }, []);

  async function loadBooks() {
    try {
      const res = await api.get("/list-book");
      const data: BookProps[] = res.data;

      const randomBooks = data.sort(() => 0.5 - Math.random());
      const booksSelected = randomBooks.slice(0, 4);

      const sports = data.filter(
        (book) => book.categoria === "Esportivo"
      );

      const mystery = data.filter(
        (book) => book.categoria === "Mistério"
      );

      const kids = data.filter(
        (book) => book.categoria === "Infantil"
      );

      const scienceFiction = data.filter(
        (book) => book.categoria === "Ficção Científica"
      );

      const romance = data.filter(
        (book) => book.categoria === "Romance"
      );

      const biography = data.filter(
        (book) => book.categoria === "Biografias"
      );

      const selfHelp = data.filter(
        (book) => book.categoria === "Autoajuda"
      );

      setDisplayedItems(booksSelected);
      setSportsBooks(sports);
      setMysteryBooks(mystery);
      setKidsBooks(kids);
      setScienceFictionBooks(scienceFiction);
      setRomanceBooks(romance);
      setBiographyBooks(biography);
      setSelfHelpBooks(selfHelp);
    } catch (error) {
      console.error("Erro ao carregar os livros", error);
    }
  }

  function handleBookClick(id: number) {
    navigate(`/book/${id}`);
  }

  function handleSportsBooks() {
    navigate(`/search?query=esportivo`);
  }

  function handleMysteryBooks() {
    navigate(`/search?query=mistério`);
  }

  function handleKidsBooks() {
    navigate(`/search?query=infantil`);
  }
  function handleScienceFictionBooks() {
    navigate(`/search?query=ficção científica`);
  }

  function handleRomanceBooks() {
    navigate(`/search?query=romance`);
  }

  function handleBiographyBooks() {
    navigate(`/search?query=biografias`);
  }

  function handleSelfHelpBooks() {
    navigate(`/search?query=autoajuda`);
  }

  return (
    <div className="w-full min-h-screen bg-stone-300 md:max-2xl">
      <Header />

      <div className="flex justify-center items-center">
        <section
          className="
            w-11/12
            h-72
            border-3
            my-10
            bg-[url('/2_20240911_155529_0001~2.png')]
            bg-no-repeat
            bg-cover
            border-slate-400
            shadow-lg
            border-2
            flex
            justify-center
            items-center
          "
        ></section>
      </div>

      <div className="w-full min-h-screen">

        {/* RECOMENDADOS */}
        <h1
          className="
            font-roboto-italic
            italic
            text-2xl
            mx-14
            w-[23rem]
            h-auto
            border-b-indigo-600
            border-r-transparent
            border-t-transparent
            border-l-transparent
            border-2
          "
        >
          RECOMENDADOS PARA VOCÊ
        </h1>

        <div className="flex justify-center items-center py-10">
          <section
            className="
              w-11/12
              h-72
              flex
              flex-row
              space-x-10
              py-2
              px-2
              rounded-xl
              bg-gradient-to-t
              from-slate-200
              to-slate-300
            "
          >
            {displayedItems.map((book) => (
              <article
                key={book.id}
                className="
                  h-full
                  w-56
                  rounded-xl
                  overflow-hidden
                  relative
                  shadow-xl
                  shadow-indigo-300
                  hover:scale-105
                  duration-200
                  cursor-pointer
                  group
                  bg-white
                "
                onClick={() => handleBookClick(book.id)}
              >
                {book.imagem && (
                  <img
                    src={`${apiUrl}/uploads/${book.imagem}`}
                    alt={book.titulo}
                    className="w-full h-full object-contain scale-90"
                  />
                )}

                <div
                  className="
                    absolute
                    inset-0
                    bg-black/70
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity
                    duration-200
                    flex
                    flex-col
                    justify-end
                    p-5
                    text-white
                  "
                >
                  <h2 className="font-bold text-lg mb-2">
                    {book.titulo}
                  </h2>

                  <p className="text-sm mb-1">
                    <span className="font-semibold">
                      Autor:
                    </span>{" "}
                    {book.autor}
                  </p>

                  <p className="text-sm">
                    <span className="font-semibold">
                      Editora:
                    </span>{" "}
                    {book.editora}
                  </p>
                </div>
              </article>
            ))}
          </section>
        </div>

        {/* ESPORTIVOS */}
        <h1
          className="
            font-roboto-italic
            italic
            text-2xl
            mx-14
            w-[23rem]
            h-auto
            border-b-indigo-600
            border-r-transparent
            border-t-transparent
            border-l-transparent
            border-2
          "
        >
          LIVROS ESPORTIVOS
        </h1>

        <div className="flex justify-center items-center py-10">
          <section
            className="
              w-11/12
              h-72
              flex
              flex-row
              space-x-10
              py-2
              px-2
              rounded-xl
              bg-gradient-to-t
              from-slate-200
              to-slate-300
            "
          >
            {sportsBooks.slice(0, 4).map((book) => (
              <article
                key={book.id}
                className="
                  h-full
                  w-56
                  rounded-xl
                  overflow-hidden
                  relative
                  shadow-xl
                  shadow-indigo-300
                  hover:scale-105
                  duration-200
                  cursor-pointer
                  group
                  bg-white
                "
                onClick={() => handleBookClick(book.id)}
              >
                {book.imagem && (
                  <img
                    src={`${apiUrl}/uploads/${book.imagem}`}
                    alt={book.titulo}
                    className="w-full h-full object-cover"
                  />
                )}

                <div
                  className="
                    absolute
                    inset-0
                    bg-black/70
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity
                    duration-200
                    flex
                    flex-col
                    justify-end
                    p-5
                    text-white
                  "
                >
                  <h2 className="font-bold text-lg mb-2">
                    {book.titulo}
                  </h2>

                  <p className="text-sm mb-1">
                    <span className="font-semibold">
                      Autor:
                    </span>{" "}
                    {book.autor}
                  </p>

                  <p className="text-sm">
                    <span className="font-semibold">
                      Editora:
                    </span>{" "}
                    {book.editora}
                  </p>
                </div>
              </article>
            ))}
          </section>
        </div>

        <div className="flex justify-center mb-10">
          <button
            onClick={handleSportsBooks}
            className="
              px-6
              py-2
              rounded-lg
              bg-indigo-600
              text-white
              font-semibold
              hover:bg-indigo-700
              transition
            "
          >
            Ver livros esportivos
          </button>
        </div>

        {/* MISTÉRIO */}
        <h1
          className="
            font-roboto-italic
            italic
            text-2xl
            mx-14
            w-[23rem]
            h-auto
            border-b-indigo-600
            border-r-transparent
            border-t-transparent
            border-l-transparent
            border-2
          "
        >
          LIVROS DE MISTÉRIO
        </h1>

        <div className="flex justify-center items-center py-10">
          <section
            className="
              w-11/12
              h-72
              flex
              flex-row
              space-x-10
              py-2
              px-2
              rounded-xl
              bg-gradient-to-t
              from-slate-200
              to-slate-300
            "
          >
            {mysteryBooks.slice(0, 4).map((book) => (
              <article
                key={book.id}
                className="
                  h-full
                  w-56
                  rounded-xl
                  overflow-hidden
                  relative
                  shadow-xl
                  shadow-indigo-300
                  hover:scale-105
                  duration-200
                  cursor-pointer
                  group
                  bg-white
                "
                onClick={() => handleBookClick(book.id)}
              >
                {book.imagem && (
                  <img
                    src={`${apiUrl}/uploads/${book.imagem}`}
                    alt={book.titulo}
                    className="w-full h-full object-cover"
                  />
                )}

                <div
                  className="
                    absolute
                    inset-0
                    bg-black/70
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity
                    duration-200
                    flex
                    flex-col
                    justify-end
                    p-5
                    text-white
                  "
                >
                  <h2 className="font-bold text-lg mb-2">
                    {book.titulo}
                  </h2>

                  <p className="text-sm mb-1">
                    <span className="font-semibold">
                      Autor:
                    </span>{" "}
                    {book.autor}
                  </p>

                  <p className="text-sm">
                    <span className="font-semibold">
                      Editora:
                    </span>{" "}
                    {book.editora}
                  </p>
                </div>
              </article>
            ))}
          </section>
        </div>

        <div className="flex justify-center mb-10">
          <button
            onClick={handleMysteryBooks}
            className="
              px-6
              py-2
              rounded-lg
              bg-indigo-600
              text-white
              font-semibold
              hover:bg-indigo-700
              transition
            "
          >
            Ver livros de mistério
          </button>
        </div>

        {/* INFANTIL */}
        <h1
          className="
            font-roboto-italic
            italic
            text-2xl
            mx-14
            w-[23rem]
            h-auto
            border-b-indigo-600
            border-r-transparent
            border-t-transparent
            border-l-transparent
            border-2
          "
        >
          LIVROS INFANTIS
        </h1>

        <div className="flex justify-center items-center py-10">
          <section
            className="
              w-11/12
              h-72
              flex
              flex-row
              space-x-10
              py-2
              px-2
              rounded-xl
              bg-gradient-to-t
              from-slate-200
              to-slate-300
            "
          >
            {kidsBooks.slice(0, 4).map((book) => (
              <article
                key={book.id}
                className="
                  h-full
                  w-56
                  rounded-xl
                  overflow-hidden
                  relative
                  shadow-xl
                  shadow-indigo-300
                  hover:scale-105
                  duration-200
                  cursor-pointer
                  group
                  bg-white
                "
                onClick={() => handleBookClick(book.id)}
              >
                {book.imagem && (
                  <img
                    src={`${apiUrl}/uploads/${book.imagem}`}
                    alt={book.titulo}
                    className="w-full h-full object-cover"
                  />
                )}

                <div
                  className="
                    absolute
                    inset-0
                    bg-black/70
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity
                    duration-200
                    flex
                    flex-col
                    justify-end
                    p-5
                    text-white
                  "
                >
                  <h2 className="font-bold text-lg mb-2">
                    {book.titulo}
                  </h2>

                  <p className="text-sm mb-1">
                    <span className="font-semibold">
                      Autor:
                    </span>{" "}
                    {book.autor}
                  </p>

                  <p className="text-sm">
                    <span className="font-semibold">
                      Editora:
                    </span>{" "}
                    {book.editora}
                  </p>
                </div>
              </article>
            ))}
          </section>
        </div>

        <div className="flex justify-center mb-10">
          <button
            onClick={handleKidsBooks}
            className="
              px-6
              py-2
              rounded-lg
              bg-indigo-600
              text-white
              font-semibold
              hover:bg-indigo-700
              transition
            "
          >
            Ver livros infantis
          </button>
        </div>

      </div>

      {/* FICÇÃO CIENTÍFICA */}
<h1 
  className="
    font-roboto-italic 
    italic 
    text-2xl 
    mx-14 
    w-[23rem] 
    h-auto 
    border-b-indigo-600 
    border-r-transparent 
    border-t-transparent 
    border-l-transparent 
    border-2 
  "
>
  FICÇÃO CIENTÍFICA
</h1>

<div className="flex justify-center items-center py-10">
  <section 
    className="
      w-11/12 
      h-72 
      flex 
      flex-row 
      space-x-10 
      py-2 
      px-2 
      rounded-xl 
      bg-gradient-to-t 
      from-slate-200 
      to-slate-300 
    "
  >
    {scienceFictionBooks.slice(0, 4).map((book) => (
      <article 
        key={book.id} 
        className="
          h-full 
          w-56 
          rounded-xl 
          overflow-hidden 
          relative 
          shadow-xl 
          shadow-indigo-300 
          hover:scale-105 
          duration-200 
          cursor-pointer 
          group 
          bg-white 
        "
        onClick={() => handleBookClick(book.id)}
      >
        {book.imagem && (
          <img 
            src={`${apiUrl}/uploads/${book.imagem}`} 
            alt={book.titulo} 
            className="w-full h-full object-cover" 
          />
        )}

        <div 
          className="
            absolute 
            inset-0 
            bg-black/70 
            opacity-0 
            group-hover:opacity-100 
            transition-opacity 
            duration-200 
            flex 
            flex-col 
            justify-end 
            p-5 
            text-white 
          "
        >
          <h2 className="font-bold text-lg mb-2">
            {book.titulo}
          </h2>

          <p className="text-sm mb-1">
            <span className="font-semibold">Autor:</span>{" "}
            {book.autor}
          </p>

          <p className="text-sm">
            <span className="font-semibold">Editora:</span>{" "}
            {book.editora}
          </p>
        </div>
      </article>
    ))}
  </section>
</div>

<div className="flex justify-center mb-10">
  <button 
    onClick={handleScienceFictionBooks}
    className="
      px-6 
      py-2 
      rounded-lg 
      bg-indigo-600 
      text-white 
      font-semibold 
      hover:bg-indigo-700 
      transition 
    "
  >
    Ver livros de ficção científica
  </button>
</div>

{/* ROMANCE */}
<h1 className="font-roboto-italic italic text-2xl mx-14 w-[23rem] h-auto border-b-indigo-600 border-r-transparent border-t-transparent border-l-transparent border-2">
  LIVROS DE ROMANCE
</h1>

<div className="flex justify-center items-center py-10">
  <section className="w-11/12 h-72 flex flex-row space-x-10 py-2 px-2 rounded-xl bg-gradient-to-t from-slate-200 to-slate-300">
    {romanceBooks.slice(0, 4).map((book) => (
      <article
        key={book.id}
        className="h-full w-56 rounded-xl overflow-hidden relative shadow-xl shadow-indigo-300 hover:scale-105 duration-200 cursor-pointer group bg-white"
        onClick={() => handleBookClick(book.id)}
      >
        {book.imagem && (
          <img
            src={`${apiUrl}/uploads/${book.imagem}`}
            alt={book.titulo}
            className="w-full h-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-5 text-white">
          <h2 className="font-bold text-lg mb-2">
            {book.titulo}
          </h2>

          <p className="text-sm mb-1">
            <span className="font-semibold">Autor:</span>{" "}
            {book.autor}
          </p>

          <p className="text-sm">
            <span className="font-semibold">Editora:</span>{" "}
            {book.editora}
          </p>
        </div>
      </article>
    ))}
  </section>
</div>

<div className="flex justify-center mb-10">
  <button
    onClick={handleRomanceBooks}
    className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
  >
    Ver livros de romance
  </button>
</div>

{/* BIOGRAFIAS */}
<h1 className="font-roboto-italic italic text-2xl mx-14 w-[23rem] h-auto border-b-indigo-600 border-r-transparent border-t-transparent border-l-transparent border-2">
  BIOGRAFIAS
</h1>

<div className="flex justify-center items-center py-10">
  <section className="w-11/12 h-72 flex flex-row space-x-10 py-2 px-2 rounded-xl bg-gradient-to-t from-slate-200 to-slate-300">
    {biographyBooks.slice(0, 4).map((book) => (
      <article
        key={book.id}
        className="h-full w-56 rounded-xl overflow-hidden relative shadow-xl shadow-indigo-300 hover:scale-105 duration-200 cursor-pointer group bg-white"
        onClick={() => handleBookClick(book.id)}
      >
        {book.imagem && (
          <img
            src={`${apiUrl}/uploads/${book.imagem}`}
            alt={book.titulo}
            className="w-full h-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-5 text-white">
          <h2 className="font-bold text-lg mb-2">
            {book.titulo}
          </h2>

          <p className="text-sm mb-1">
            <span className="font-semibold">Autor:</span>{" "}
            {book.autor}
          </p>

          <p className="text-sm">
            <span className="font-semibold">Editora:</span>{" "}
            {book.editora}
          </p>
        </div>
      </article>
    ))}
  </section>
</div>

<div className="flex justify-center mb-10">
  <button
    onClick={handleBiographyBooks}
    className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
  >
    Ver livros de biografias
  </button>
</div>

{/* AUTOAJUDA */}
<h1 className="font-roboto-italic italic text-2xl mx-14 w-[23rem] h-auto border-b-indigo-600 border-r-transparent border-t-transparent border-l-transparent border-2">
  AUTOAJUDA
</h1>

<div className="flex justify-center items-center py-10">
  <section className="w-11/12 h-72 flex flex-row space-x-10 py-2 px-2 rounded-xl bg-gradient-to-t from-slate-200 to-slate-300">
    {selfHelpBooks.slice(0, 4).map((book) => (
      <article
        key={book.id}
        className="h-full w-56 rounded-xl overflow-hidden relative shadow-xl shadow-indigo-300 hover:scale-105 duration-200 cursor-pointer group bg-white"
        onClick={() => handleBookClick(book.id)}
      >
        {book.imagem && (
          <img
            src={`${apiUrl}/uploads/${book.imagem}`}
            alt={book.titulo}
            className="w-full h-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-5 text-white">
          <h2 className="font-bold text-lg mb-2">
            {book.titulo}
          </h2>

          <p className="text-sm mb-1">
            <span className="font-semibold">Autor:</span>{" "}
            {book.autor}
          </p>

          <p className="text-sm">
            <span className="font-semibold">Editora:</span>{" "}
            {book.editora}
          </p>
        </div>
      </article>
    ))}
  </section>
</div>

<div className="flex justify-center mb-10">
  <button
    onClick={handleSelfHelpBooks}
    className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
  >
    Ver livros de autoajuda
  </button>
</div>



      <Footer />
    </div>
  );
}

export default HomePage;

