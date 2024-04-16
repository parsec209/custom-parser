import { useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import { Divider, Text, IconButton, Button } from "react-native-paper";
import { Link } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function ScannerPage() {
  const [selectedImage1, setSelectedImage1] = useState(null);
  const [selectedImage2, setSelectedImage2] = useState(null);

  const [status, requestPermission] = ImagePicker.useCameraPermissions();

  const pickImage = async (imageNumber) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      imageNumber === 1
        ? setSelectedImage1(result.assets[0].uri)
        : setSelectedImage2(result.assets[0].uri);
    } else {
      alert("No image selected");
    }
  };

  const takePhoto = async (imageNumber) => {
    const pendingResult = await ImagePicker.getPendingResultAsync();
    if (pendingResult && pendingResult.length > 0) {
      console.log(pendingResult);
    }
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      imageNumber === 1
        ? setSelectedImage1(result.assets[0].uri)
        : setSelectedImage2(result.assets[0].uri);
    } else {
      alert("No image selected");
    }
  };

  if (status === null) {
    requestPermission();
  }

  return (
    <View style={styles.container}>
      <Text variant="bodyMedium">Scan up to two images.</Text>
      <Text variant="bodyMedium">Use camera or photo library.</Text>
      <Divider bold style={styles.divider} />

      <View style={styles.imagesContainer}>
        <View>
          <View style={styles.imageContainer}>
            {selectedImage1 ? (
              <Image source={{ uri: selectedImage1 }} style={styles.image} />
            ) : (
              <View style={styles.imageIconContainer}>
                <IconButton
                  icon="camera"
                  iconColor="black"
                  size={40}
                  onPress={() => takePhoto(1)}
                />
                <IconButton
                  icon="upload"
                  iconColor="black"
                  size={40}
                  onPress={() => pickImage(1)}
                />
              </View>
            )}
          </View>
          {
            <Button
              mode="text"
              style={selectedImage1 ? { opacity: 1 } : { opacity: 0 }}
              onPress={() => setSelectedImage1(null)}
              disabled={!selectedImage1}
            >
              Reset
            </Button>
          }
        </View>
        <View>
          <View style={styles.imageContainer}>
            {selectedImage2 ? (
              <Image source={{ uri: selectedImage2 }} style={styles.image} />
            ) : (
              <View style={styles.imageIconContainer}>
                <IconButton
                  icon="camera"
                  iconColor="black"
                  size={40}
                  onPress={() => takePhoto(2)}
                />
                <IconButton
                  icon="upload"
                  iconColor="black"
                  size={40}
                  onPress={() => pickImage(2)}
                />
              </View>
            )}
          </View>
          <Button
            mode="text"
            style={selectedImage2 ? { opacity: 1 } : { opacity: 0 }}
            onPress={() => setSelectedImage2(null)}
            disabled={!selectedImage2}
          >
            Reset
          </Button>
        </View>
      </View>
      
      <Button
        mode="contained"
        buttonColor="blue"
        //disabled={!selectedImage1 && !selectedImage2}
        onPress={() => {}}
      >
        <Link href="../parsers">Select parser</Link>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  imagesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  imageContainer: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgray",
    marginHorizontal: 10,
  },
  imageIconContainer: {
    flexDirection: "row",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover", // Adjust as needed
  },
  scanButton: {
    marginVertical: 30,
  },
});

