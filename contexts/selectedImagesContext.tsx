import { createContext } from "react";

// export interface GamesContextType {
//   games: Game[];
//   setGames: (games: Game[]) => void;
// }

//export const selectedImagesContext = createContext<GamesContextType>({
export const SelectedImagesContext = createContext({
  selectedImages: [null, null],
  setSelectedImages: () => {},
});

export const SelectedImagesProvider = SelectedImagesContext.Provider;
