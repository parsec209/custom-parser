import { StyleSheet, View } from "react-native";
import { Divider, Text, Button } from "react-native-paper";
import { Link } from "expo-router";

import ImageSelection from "../../components/ImageSelection";

export default function ScannerPage() {
  return (
    <View style={styles.container}>
      <Text variant="bodyMedium">Select up to two images per scan.</Text>
      <Text variant="bodyMedium">Use camera or photo library.</Text>
      <Divider bold style={styles.divider} />

      <View style={styles.imageSelections}>
        <ImageSelection selectedImagesIndex={0} />
        <ImageSelection selectedImagesIndex={1} />
      </View>

      <Button
        mode="contained"
        buttonColor="blue"
        //disabled={!selectedImages[0] && !selectedImage2}
        onPress={() => {}}
      >
        <Link href="../parsers-modal">Select parser</Link>
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
  imageSelections: {
    flexDirection: "row",
    alignItems: "center",
  },
});
