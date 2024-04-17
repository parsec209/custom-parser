import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

import { SelectedImagesContext } from "../contexts/ImageSelectorIconsContainer";


export default function ImageSelectorIconsContainer() {
  const [selectedImages, setSelectedImages] = useContext(SelectedImagesContext) // as GamesContextType (example), type is defined in context file;

  const [status, requestPermission] = ImagePicker.useCameraPermissions();

  const pickImage = async () => {
    const { assets } = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    return assets ? assets[0].uri : assets
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
    return assets ? assets[0].uri : assets
  };

  if (status === null) {
    requestPermission();
  }

  return (

              <View style={styles.container}>
                <IconButton
              icon="camera"
              iconColor="black"
              size={40}
              onPress={() => takePhoto()
                />
                <IconButton
                  icon="upload"
                  iconColor="black"
                  size={40}
                  onPress={() => pickImage()}
                />
              </View>
         
  );
}

const styles = StyleSheet.create({
 

  container: {
    flexDirection: "row",
  },

});

