import { createContext } from "react";

// export interface GamesContextType {
//   games: Game[];
//   setGames: (games: Game[]) => void;
// }

//export const selectedImagesContext = createContext<GamesContextType>({
export const IsLoadingContext = createContext({
  isLoading: false,
  setIsLoading: () => {},
});

export const IsLoadingProvider = IsLoadingContext.Provider;
