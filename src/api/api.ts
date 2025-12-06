export const API_KEY = "14623032330347328ccac22aded6c2fd";
export const API_BASE = "https://backend-js-games-rwag.onrender.com";

export async function fetchGames(page = 1) {
  const res = await fetch(
    `https://api.rawg.io/api/games?key=${API_KEY}&page=${page}`
  );
  if (!res.ok) throw new Error("Erro ao buscar jogos");
  return res.json();
}
export async function createList(title: string) {
  const res = await fetch(`${API_BASE}/lists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title })
  });
  if (!res.ok) throw new Error("Erro ao criar lista");
  return res.json();
}

// deleta lista
export async function deleteList(id: string) {
  const res = await fetch(`${API_BASE}/lists/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erro ao deletar lista");
  return res.json();
}

// adiciona um jogo a lista
export async function addGame(listId: string, game: any) {
  const res = await fetch(`${API_BASE}/lists/${listId}/games`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(game)
  });
  if (!res.ok) throw new Error("Erro ao adicionar jogo");
  return res.json();
}

// deleta um jogo de uma lista
export async function deleteGame(listId: string, gameId: string) {
  const res = await fetch(`${API_BASE}/lists/${listId}/games/${gameId}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Erro ao deletar jogo");
  return res.json();
}