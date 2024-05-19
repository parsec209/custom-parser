import { View, Image, StyleSheet } from "react-native";
import { Button, IconButton } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

export default function ImageSelection({ image, handleImageUpdate }) {
  const [status, requestPermission] = ImagePicker.useCameraPermissions();

  if (status === null) {
    requestPermission();
  }

  const checkImage = async (uri) => {
    try {
      const info = await FileSystem.getInfoAsync(uri);
      if (!info.exists) {
        handleImageUpdate(null);
      }
    } catch (err) {
      alert(err);
      console.error(err);
    }
  };

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

  const updateImage = async (iconType) => {
    let imageUri = null;
    if (iconType === "camera") {
      imageUri = await takePhoto();
    } else if (iconType === "upload") {
      imageUri = await pickImage();
    }
    handleImageUpdate(imageUri);
  };

  return (
    <View>
      <View style={styles.imageContainer}>
        {image ? (
          <Image
            source={{ uri: image }}
            style={styles.image}
            onLoad={() => {
              checkImage(image);
            }}
          />
        ) : (
          <View style={styles.imageSelectorIconsContainer}>
            <IconButton
              icon="camera"
              iconColor="black"
              size={40}
              onPress={() => updateImage("camera")}
            />
            <IconButton
              icon="upload"
              iconColor="black"
              size={40}
              onPress={() => updateImage("upload")}
            />
          </View>
        )}
      </View>
      <Button
        mode="text"
        style={image ? { opacity: 1 } : { opacity: 0 }}
        onPress={updateImage}
        disabled={!image}
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
