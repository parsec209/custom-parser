import { createContext } from "react";

// export interface GamesContextType {
//   games: Game[];
//   setGames: (games: Game[]) => void;
// }

//export const selectedImagesContext = createContext<GamesContextType>({
export const ImagesDataContext = createContext({
  imagesData: [],
  setImagesData: () => {},
});

export const ImagesDataProvider = ImagesDataContext.Provider;
