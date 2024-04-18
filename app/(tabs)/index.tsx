import { useContext } from "react";
import { StyleSheet, View, Image } from "react-native";
import { Divider, Text, Button } from "react-native-paper";
import { Link } from "expo-router";

import { SelectedImagesContext } from "../../contexts/selectedImagesContext";
import ImageSelectorIconsContainer from "../../components/ImageSelectorIconsContainer";

export default function ScannerPage() {
  const [selectedImages, setSelectedImages] = useContext(SelectedImagesContext); // as GamesContextType (example), type is defined in context file;

  return (
    <View style={styles.container}>
      <Text variant="bodyMedium">Scan up to two images.</Text>
      <Text variant="bodyMedium">Use camera or photo library.</Text>
      <Divider bold style={styles.divider} />

      <View style={styles.imagesContainer}>
        <View>
          <View style={styles.imageContainer}>
            {selectedImages[0] ? (
              <Image source={{ uri: selectedImages[0] }} style={styles.image} />
            ) : (
              <ImageSelectorIconsContainer selectedImagesIndex={0} />
            )}
          </View>
          {
            <Button
              mode="text"
              style={selectedImages[0] ? { opacity: 1 } : { opacity: 0 }}
              onPress={() => setSelectedImage1(null)}
              disabled={!selectedImages[0]}
            >
              Reset
            </Button>
          }
        </View>
        <View>
          <View style={styles.imageContainer}>
            {selectedImages[1] ? (
              <Image source={{ uri: selectedImages[1] }} style={styles.image} />
            ) : (
              <ImageSelectorIconsContainer selectedImagesIndex={1} />
            )}
          </View>
          <Button
            mode="text"
            style={selectedImages[1] ? { opacity: 1 } : { opacity: 0 }}
            onPress={() => setSelectedImage2(null)}
            disabled={!selectedImages[1]}
          >
            Reset
          </Button>
        </View>
      </View>

      <Button
        mode="contained"
        buttonColor="blue"
        //disabled={!selectedImages[0] && !selectedImage2}
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

  scanButton: {
    marginVertical: 30,
  },
});
