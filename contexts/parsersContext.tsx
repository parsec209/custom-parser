import { createContext } from "react";

// export interface GamesContextType {
//   games: Game[];
//   setGames: (games: Game[]) => void;
// }

//export const selectedImagesContext = createContext<GamesContextType>({
export const ParsersContext = createContext({
  parsers: [],
  setParsers: () => {},
});

export const ParsersProvider = ParsersContext.Provider;
