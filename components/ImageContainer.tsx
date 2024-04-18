import { useContext } from "react";
import { StyleSheet, View, Image } from "react-native";

import { SelectedImagesContext } from "../contexts/selectedImagesContext";
import ImageSelectorIconsContainer from "./ImageSelectorIconsContainer";

export default function ImageContainer({ selectedImagesIndex }) {
  const [selectedImages] = useContext(SelectedImagesContext); // as GamesContextType (example), type is defined in context file;

  return (
    <View style={styles.container}>
      {selectedImages[selectedImagesIndex] ? (
        <Image
          source={{ uri: selectedImages[selectedImagesIndex] }}
          style={styles.image}
        />
      ) : (
        <ImageSelectorIconsContainer
          selectedImagesIndex={selectedImagesIndex}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgray",
    marginHorizontal: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
