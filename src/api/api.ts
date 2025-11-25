export const API_KEY = "14623032330347328ccac22aded6c2fd";

export async function fetchGames(page = 1) {
  const res = await fetch(
    `https://api.rawg.io/api/games?key=${API_KEY}&page=${page}`
  );
  if (!res.ok) throw new Error("Erro ao buscar jogos");
  return res.json();
}