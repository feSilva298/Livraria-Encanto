// ============================================================
// "Banco de dados" em memória, usado quando USE_DATABASE = false
// (ver server/src/config.ts). Os dados vivem só enquanto o
// processo do servidor estiver rodando; ao reiniciar, tudo volta
// ao estado inicial (seed) definido abaixo.
// ============================================================

interface Livro {
  id: number;
  titulo: string;
  descricao: string;
  autor: string;
  categoria: string;
  classificacao: string;
  paginas: number;
  editora: string;
  ano_pub: number;
  preco: number;
  imagem: string | null;
}

interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
}

interface Editora {
  id: number;
  CNPJ: string;
  nome: string;
  email: string;
  senha: string;
}

interface Carrinho {
  id: number;
  usuario_id: number;
}

interface ItemCarrinho {
  id: number;
  carrinho_id: number;
  produto_id: number;
  quantidade: number;
}

interface Pedido {
  id: number;
  usuario_id: number;
  total: number;
  status: string;
  data_criacao: Date;
}

interface ItemPedido {
  id: number;
  pedido_id: number;
  produto_id: number;
  quantidade: number;
  preco: number;
}

const nextIds = { livro: 1, usuario: 1, editora: 1, carrinho: 1, itemCarrinho: 1, pedido: 1, itemPedido: 1 };

const livros: Livro[] = [];
const usuarios: Usuario[] = [];
const editoras: Editora[] = [];
const carrinhos: Carrinho[] = [];
const itensCarrinho: ItemCarrinho[] = [];
const pedidos: Pedido[] = [];
const itensPedido: ItemPedido[] = [];

// ---- Dados iniciais (seed) ----
// Edite esta lista à vontade para adicionar/remover/alterar os livros
// exibidos quando USE_DATABASE = false. É este o "lugar para salvar
// os livros sem banco de dados". O campo `imagem` fica null de
// propósito: a ideia é o front-end mapear a imagem pelo `id` ou
// `titulo` do livro (o tal do .map do lado do front).
//
// Obs: a Home.tsx do front-end monta seções específicas para as
// categorias "Esportivo", "Mistério" e "Infantil" — por isso o seed
// abaixo inclui pelo menos alguns livros dessas categorias.
function seed() {
  editoras.push({
    id: nextIds.editora++,
    CNPJ: '12345678000199',
    nome: 'Editora Exemplo',
    email: 'contato@editoraexemplo.com',
    senha: '$2b$10$kpTqtNsUuIuqVaYLpjHyHOq/Hmd5VDv28diJV/jgzixQK0//7SI/m',
  });

  const livrosSeed: Omit<Livro, 'id' | 'imagem'>[] = [
    {
      titulo: 'O Senhor dos Anéis',
      descricao: 'Uma jornada épica pela Terra Média.',
      autor: 'J.R.R. Tolkien',
      categoria: 'Fantasia',
      classificacao: 'Livre',
      paginas: 576,
      editora: 'Editora Exemplo',
      ano_pub: 1954,
      preco: 79.9,
    },
    {
      titulo: 'Duna',
      descricao: 'Ficção científica em um planeta desértico.',
      autor: 'Frank Herbert',
      categoria: 'Ficção',
      classificacao: 'Livre',
      paginas: 688,
      editora: 'Editora Exemplo',
      ano_pub: 1965,
      preco: 59.9,
    },
    {
      titulo: 'Fever Pitch',
      descricao: 'A obsessão de um torcedor pelo futebol inglês.',
      autor: 'Nick Hornby',
      categoria: 'Esportivo',
      classificacao: 'Livre',
      paginas: 245,
      editora: 'Editora Exemplo',
      ano_pub: 1992,
      preco: 44.9,
    },
    {
      titulo: 'A Arte da Corrida',
      descricao: 'Como o atletismo transforma a mente e o corpo.',
      autor: 'Matt Fitzgerald',
      categoria: 'Esportivo',
      classificacao: 'Livre',
      paginas: 210,
      editora: 'Editora Exemplo',
      ano_pub: 2015,
      preco: 39.9,
    },
    {
      titulo: 'E Não Sobrou Nenhum',
      descricao: 'Dez desconhecidos, uma ilha isolada e um assassino entre eles.',
      autor: 'Agatha Christie',
      categoria: 'Mistério',
      classificacao: '14 anos',
      paginas: 264,
      editora: 'Editora Exemplo',
      ano_pub: 1939,
      preco: 49.9,
    },
    {
      titulo: 'A Garota no Trem',
      descricao: 'Um mistério que se desenrola através da janela de um trem.',
      autor: 'Paula Hawkins',
      categoria: 'Mistério',
      classificacao: '16 anos',
      paginas: 336,
      editora: 'Editora Exemplo',
      ano_pub: 2015,
      preco: 42.9,
    },
    {
      titulo: 'O Pequeno Príncipe',
      descricao: 'Um piloto perdido no deserto encontra um pequeno príncipe de outro planeta.',
      autor: 'Antoine de Saint-Exupéry',
      categoria: 'Infantil',
      classificacao: 'Livre',
      paginas: 96,
      editora: 'Editora Exemplo',
      ano_pub: 1943,
      preco: 34.9,
    },
    {
      titulo: 'Onde Vivem os Monstros',
      descricao: 'Max embarca em uma viagem imaginária até a terra dos monstros.',
      autor: 'Maurice Sendak',
      categoria: 'Infantil',
      classificacao: 'Livre',
      paginas: 48,
      editora: 'Editora Exemplo',
      ano_pub: 1963,
      preco: 29.9,
    },
  ];

  for (const livro of livrosSeed) {
    livros.push({ id: nextIds.livro++, imagem: null, ...livro });
  }
}
seed();

export const mockDb = {
  livros: {
    listAll: async (): Promise<Livro[]> => livros,

    search: async (term: string): Promise<Livro[]> => {
      const t = term.toLowerCase();
      return livros.filter(
        (l) =>
          l.titulo.toLowerCase().includes(t) ||
          l.autor.toLowerCase().includes(t) ||
          l.categoria.toLowerCase().includes(t),
      );
    },

    findById: async (id: number): Promise<Livro | null> => livros.find((l) => l.id === Number(id)) ?? null,

    create: async (data: Omit<Livro, 'id' | 'imagem'>): Promise<Livro> => {
      const livro: Livro = { id: nextIds.livro++, imagem: null, ...data };
      livros.push(livro);
      return livro;
    },

    remove: async (id: number): Promise<boolean> => {
      const idx = livros.findIndex((l) => l.id === Number(id));
      if (idx === -1) return false;
      livros.splice(idx, 1);
      return true;
    },

    setImagem: async (id: number, fileName: string): Promise<Livro | null> => {
      const livro = livros.find((l) => l.id === Number(id));
      if (livro) livro.imagem = fileName;
      return livro ?? null;
    },
  },

  usuarios: {
    findByEmail: async (email: string): Promise<Usuario | null> => usuarios.find((u) => u.email === email) ?? null,
    findById: async (id: number): Promise<Usuario | null> => usuarios.find((u) => u.id === Number(id)) ?? null,
    countByEmail: async (email: string): Promise<number> => usuarios.filter((u) => u.email === email).length,
    create: async (data: Omit<Usuario, 'id'>): Promise<Usuario> => {
      const usuario: Usuario = { id: nextIds.usuario++, ...data };
      usuarios.push(usuario);
      return usuario;
    },
  },

  editoras: {
    findByEmail: async (email: string): Promise<Editora | null> => editoras.find((e) => e.email === email) ?? null,
    findByCnpj: async (cnpj: string): Promise<Editora | null> => editoras.find((e) => e.CNPJ === cnpj) ?? null,
    findById: async (id: number): Promise<Editora | null> => editoras.find((e) => e.id === Number(id)) ?? null,
    countByCnpj: async (cnpj: string): Promise<number> => editoras.filter((e) => e.CNPJ === cnpj).length,
    countByEmail: async (email: string): Promise<number> => editoras.filter((e) => e.email === email).length,
    create: async (data: Omit<Editora, 'id'>): Promise<Editora> => {
      const editora: Editora = { id: nextIds.editora++, ...data };
      editoras.push(editora);
      return editora;
    },
  },

  carrinho: {
    adicionarItem: async (usuarioId: number, produtoId: number, quantidade: number) => {
      let carrinho = carrinhos.find((c) => c.usuario_id === usuarioId);
      if (!carrinho) {
        carrinho = { id: nextIds.carrinho++, usuario_id: usuarioId };
        carrinhos.push(carrinho);
      }

      const itemExistente = itensCarrinho.find(
        (i) => i.carrinho_id === carrinho!.id && i.produto_id === produtoId,
      );
      if (itemExistente) {
        itemExistente.quantidade += quantidade;
      } else {
        itensCarrinho.push({ id: nextIds.itemCarrinho++, carrinho_id: carrinho.id, produto_id: produtoId, quantidade });
      }

      return mockDb.carrinho.obterPorUsuarioId(usuarioId);
    },

    obterPorUsuarioId: async (usuarioId: number) => {
      const carrinho = carrinhos.find((c) => c.usuario_id === usuarioId);
      if (!carrinho) return [];

      return itensCarrinho
        .filter((i) => i.carrinho_id === carrinho.id)
        .map((item) => {
          const produto = livros.find((l) => l.id === item.produto_id);
          const editora = editoras.find((e) => e.nome === produto?.editora);
          return {
            id: item.id,
            produto_id: item.produto_id,
            quantidade: item.quantidade,
            titulo: produto?.titulo ?? '',
            preco: produto?.preco ?? 0,
            imagem: produto?.imagem ?? null,
            cnpj: editora?.CNPJ ?? '',
            preco_total: (produto?.preco ?? 0) * item.quantidade,
          };
        });
    },

    removerItem: async (itemCarrinhoId: number) => {
      const idx = itensCarrinho.findIndex((i) => i.id === Number(itemCarrinhoId));
      if (idx !== -1) itensCarrinho.splice(idx, 1);
    },

    limparCarrinho: async (usuarioId: number) => {
      const carrinho = carrinhos.find((c) => c.usuario_id === usuarioId);
      if (!carrinho) return;
      for (let i = itensCarrinho.length - 1; i >= 0; i--) {
        if (itensCarrinho[i].carrinho_id === carrinho.id) itensCarrinho.splice(i, 1);
      }
      const cIdx = carrinhos.findIndex((c) => c.id === carrinho.id);
      if (cIdx !== -1) carrinhos.splice(cIdx, 1);
    },
  },

  pedidos: {
    criar: async (usuarioId: number) => {
      const carrinho = carrinhos.find((c) => c.usuario_id === usuarioId);
      const itens = carrinho ? itensCarrinho.filter((i) => i.carrinho_id === carrinho.id) : [];

      if (itens.length === 0) throw new Error('Carrinho vazio');

      let total = 0;
      const dadosItens = itens.map((item) => {
        const produto = livros.find((l) => l.id === item.produto_id);
        const preco = produto?.preco ?? 0;
        total += preco * item.quantidade;
        return { produto_id: item.produto_id, quantidade: item.quantidade, preco };
      });

      const pedido: Pedido = {
        id: nextIds.pedido++,
        usuario_id: usuarioId,
        total,
        status: 'COMPLETO',
        data_criacao: new Date(),
      };
      pedidos.push(pedido);

      for (const item of dadosItens) {
        const precoTotal = item.preco * item.quantidade;
        itensPedido.push({
          id: nextIds.itemPedido++,
          pedido_id: pedido.id,
          produto_id: item.produto_id,
          quantidade: item.quantidade,
          preco: precoTotal,
        });
      }

      await mockDb.carrinho.limparCarrinho(usuarioId);

      return { id: pedido.id, usuarioId, total, itens: dadosItens };
    },

    listarPorUsuarioId: async (usuarioId: number) => {
      const pedidosDoUsuario = pedidos.filter((p) => p.usuario_id === usuarioId);
      return pedidosDoUsuario.map((pedido) => ({
        id: pedido.id,
        data_criacao: pedido.data_criacao,
        total: pedido.total,
        status: pedido.status,
        itens: itensPedido
          .filter((ip) => ip.pedido_id === pedido.id)
          .map((ip) => ({ produto_id: ip.produto_id, quantidade: ip.quantidade, preco: ip.preco })),
      }));
    },
  },
};
