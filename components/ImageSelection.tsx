import { useContext } from "react";
import { View, Image } from "react-native";
import { Button, IconButton } from "react-native-paper";

import { SelectedImagesContext } from "../contexts/selectedImagesContext";
import { takePhoto, pickImage } from "../services/imagePickerService";

export default function ImageSelectionContainer({ selectedImagesIndex }) {
  const [selectedImages, setSelectedImages] = useContext(SelectedImagesContext); // as GamesContextType (example), type is defined in context file;

  const getAndSetSelectedImages = async (iconType, selectedImagesIndex) => {
    let image = null;
    if (iconType === "camera") {
      image = await takePhoto();
    } else {
      image = await pickImage();
    }
    const updatedSelectedImages = [...selectedImages];
    updatedSelectedImages[selectedImagesIndex] = image;
    setSelectedImages(updatedSelectedImages);
  };

  const resetImage = () => {
    const updatedSelectedImages = [...selectedImages];
    updatedSelectedImages[selectedImagesIndex] = null; //
    setSelectedImages(updatedSelectedImages);
  };

  return (
    <View>
      <View style={styles.imageContainer}>
        {selectedImages[selectedImagesIndex] ? (
          <Image
            source={{ uri: selectedImages[selectedImagesIndex] }}
            style={styles.image}
          />
        ) : (
          <View style={styles.imageSelectorIconsContainer}>
            <IconButton
              icon="camera"
              iconColor="black"
              size={40}
              onPress={() =>
                getAndSetSelectedImages("camera", selectedImagesIndex)
              }
            />
            <IconButton
              icon="upload"
              iconColor="black"
              size={40}
              onPress={() =>
                getAndSetSelectedImages("upload", selectedImagesIndex)
              }
            />
          </View>
        )}
      </View>
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

const styles = StyleSheet.create({
  imageContainer: {
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
  imageSelectorIconsContainer: {
    flexDirection: "row",
  },
});
