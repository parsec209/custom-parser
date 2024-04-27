import { useContext } from "react";
import { View, Image, StyleSheet } from "react-native";
import { Button, IconButton } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

import { SelectedImagesContext } from "../contexts/selectedImagesContext";

export default function ImageSelection({ selectedImagesIndex }) {
  const {selectedImages, setSelectedImages} = useContext(SelectedImagesContext); // as GamesContextType (example), type is defined in context file;

  const [status, requestPermission] = ImagePicker.useCameraPermissions();

  if (status === null) {
    requestPermission();
  }

  const pickImage = async () => {
    const { assets } = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    return assets ? assets[0].uri : assets;
  };
  
  const takePhoto = async () => {
    const pendingResult = await ImagePicker.getPendingResultAsync();
    if (pendingResult && pendingResult.length > 0) {
      console.log(pendingResult);
    }
    const { assets } = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    return assets ? assets[0].uri : assets;
  };

  const getAndSetSelectedImages = async (iconType) => {
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
                getAndSetSelectedImages("camera")
              }
            />
            <IconButton
              icon="upload"
              iconColor="black"
              size={40}
              onPress={() =>
                getAndSetSelectedImages("upload")
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
        onPress={() => resetImage()}
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
