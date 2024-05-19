import { StyleSheet, View } from "react-native";

import ImageDataSelections from "../../components/ImageDataSelections";

export default function ImagesDataTab() {
  return (
    <View style={styles.container}>
      <ImageDataSelections />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
