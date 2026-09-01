// ============================================================
// Interruptor entre modo "com banco de dados" e modo "sem banco".
//
// true  -> usa o MySQL normalmente (precisa do .env configurado
//          e de um banco rodando, com as tabelas criadas).
// false -> usa dados fictícios guardados em memória
//          (server/src/database/mockStore.ts). Não precisa de
//          banco nenhum rodando, ótimo pra apresentação/testes.
//
// Ao trocar entre true/false, reinicie o servidor (npm run dev)
// para o efeito valer.
// ============================================================
export const USE_DATABASE = false;
