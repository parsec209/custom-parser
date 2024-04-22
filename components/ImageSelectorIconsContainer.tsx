import { useContext } from "react";
import { StyleSheet, View } from "react-native";
// import { IconButton } from "react-native-paper";

import { SelectedImagesContext } from "../contexts/selectedImagesContext";
// import { takePhoto, pickImage } from "../services/imagePickerService";

export default function ImageSelectorIconsContainer({ selectedImagesIndex }) {
  // const [selectedImages, setSelectedImages] = useContext(SelectedImagesContext); // as GamesContextType (example), type is defined in context file;

  // const getAndSetSelectedImages = async (iconType, selectedImagesIndex) => {
  //   let image = null;
  //   if (iconType === "camera") {
  //     image = await takePhoto();
  //   } else {
  //     image = await pickImage();
  //   }
  //   const updatedSelectedImages = [...selectedImages];
  //   updatedSelectedImages[selectedImagesIndex] = image;
  //   setSelectedImages(updatedSelectedImages);
  // };

  return (
    // <View style={styles.imageSelectorIconsContainer}>
    //   <IconButton
    //     icon="camera"
    //     iconColor="black"
    //     size={40}
    //     onPress={() => getAndSetSelectedImages("camera", selectedImagesIndex)}
    //   />
    //   <IconButton
    //     icon="upload"
    //     iconColor="black"
    //     size={40}
    //     onPress={() => getAndSetSelectedImages("upload", selectedImagesIndex)}
    //   />
    // </View>
  );
}

const styles = StyleSheet.create({
  // imageSelectorIconsContainer: {
  //   flexDirection: "row",
  // },
});
