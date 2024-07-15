import { StyleSheet, View } from "react-native";

import ParserSelections from "../components/ParserSelections";

export default function ParsersModal() {
  return (
    <View style={styles.container}>
      <ParserSelections />
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
