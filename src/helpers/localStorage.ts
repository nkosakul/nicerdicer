export type GameInfoType = {
  gameId: string;
  playerId: 1 | 2;
};

const storageName = 'nicerdicer';

export const getGamesFromLocalStorage = (): Array<GameInfoType> => {
  return JSON.parse(localStorage.getItem(storageName) || '[]');
};

// add game to local storage
export const addGameToLocalStorage = (payload: GameInfoType) => {
  // get all games of the user from local storage
  const games = getGamesFromLocalStorage();

  // add new game to the array
  games.push(payload);

  // save to local storage
  localStorage.setItem(storageName, JSON.stringify(games));
};

// remove game from local storage
export const removeGameFromLocalStorage = (gameId: string) => {
  const games = getGamesFromLocalStorage();
  const filteredGames = games.filter(game => game.gameId !== gameId);
  console.log('filteredGames', filteredGames);
  localStorage.setItem(storageName, JSON.stringify(filteredGames));
};
