import { StyleSheet, View } from "react-native";
import { Divider, Text, Button } from "react-native-paper";
import { Link } from "expo-router";

import ImageSelectionsContainer from "../../components/ImageSelectionsContainer";

export default function ScannerPage() {
  return (
    <View style={styles.container}>
      <Text variant="bodyMedium">Selected up to two images per scan.</Text>
      <Divider bold style={styles.divider} />

      <ImageSelectionsContainer />

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
  }
});
