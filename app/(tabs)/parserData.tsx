import { StyleSheet, View } from "react-native";

import ParserDataSelections from "../../components/ParserDataSelections";

export default function ParserDataTab() {
  return (
    <View style={styles.container}>
      <ParserDataSelections />
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
