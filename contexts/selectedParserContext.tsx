import { createContext } from "react";

// export interface GamesContextType {
//   games: Game[];
//   setGames: (games: Game[]) => void;
// }

//export const selectedImagesContext = createContext<GamesContextType>({
export const SelectedParserContext = createContext({
  selectedParser: {},
  setSelectedParser: () => {},
});

export const SelectedParserProvider = SelectedParserContext.Provider;
