// import { useContext } from "react";
// import { StyleSheet, View } from "react-native";
// import { RadioButton, Text } from "react-native-paper";

// import { SelectedParserContext } from "../contexts/selectedParserContext";

export default function ParserSelection({ parser }) {
  // const [selectedParser, setSelectedParser] = useContext(SelectedParserContext); // as GamesContextType (example), type is defined in context file;

  return (
    // <View style={styles.container}>
    //   <RadioButton
    //     value={parser.id}
    //     status={selectedParser.id === parser.id ? "checked" : "unchecked"}
    //     onPress={() => {
    //       setSelectedParser(parser);
    //     }}
    //   />
    //   <Text variant="labelMedium">{parser.name}</Text>
    // </View>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flexDirection: "row",
  // },
});
