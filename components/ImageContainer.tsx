import { useContext } from "react";
import { StyleSheet, View, Image } from "react-native";
import { IconButton } from "react-native-paper";


import { SelectedImagesContext } from "../contexts/selectedImagesContext";
import ImageSelectorIconsContainer from "./ImageSelectorIconsContainer";
import { takePhoto, pickImage } from "../services/imagePickerService";


export default function ImageContainer({ selectedImagesIndex }) {
  const [selectedImages, setSelectedImages] = useContext(SelectedImagesContext); // as GamesContextType (example), type is defined in context file;

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
    // <View style={styles.container}>
    //   {selectedImages[selectedImagesIndex] ? (
    //     <Image
    //       source={{ uri: selectedImages[selectedImagesIndex] }}
    //       style={styles.image}
    //     />
    //   ) : (
    //     <View style={styles.imageSelectorIconsContainer}>
    //     <IconButton
    //       icon="camera"
    //       iconColor="black"
    //       size={40}
    //       onPress={() => getAndSetSelectedImages("camera", selectedImagesIndex)}
    //     />
    //     <IconButton
    //       icon="upload"
    //       iconColor="black"
    //       size={40}
    //       onPress={() => getAndSetSelectedImages("upload", selectedImagesIndex)}
    //     />
    //   </View>
    //   )}
    // </View>
  );
}

const styles = StyleSheet.create({
  // imageContainer: {
  //   width: 150,
  //   height: 150,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   backgroundColor: "lightgray",
  //   marginHorizontal: 10,
  // },
  // image: {
  //   width: "100%",
  //   height: "100%",
  //   resizeMode: "cover",
  // },
  // imageSelectorIconsContainer: {
  //   flexDirection: "row",
  // },
});
