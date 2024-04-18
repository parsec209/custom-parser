import { useContext } from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";

import { SelectedImagesContext } from "../contexts/selectedImagesContext";
import ImageContainer from "./ImageContainer";

export default function ImageSelectionContainer({ selectedImagesIndex }) {
  const [selectedImages, setSelectedImages] = useContext(SelectedImagesContext); // as GamesContextType (example), type is defined in context file;

  const resetImage = () => {
    const updatedSelectedImages = [...selectedImages];
    updatedSelectedImages[selectedImagesIndex] = null; //
    setSelectedImages(updatedSelectedImages);
  };

  return (
    <View>
      <ImageContainer selectedImagesIndex={selectedImagesIndex} />
      <Button
        mode="text"
        style={
          selectedImages[selectedImagesIndex] ? { opacity: 1 } : { opacity: 0 }
        }
        onPress={resetImage}
        disabled={!selectedImages[selectedImagesIndex]}
      >
        Reset
      </Button>
    </View>
  );
}
