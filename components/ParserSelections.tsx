// import { useEffect, useContext } from "react";
// import { StyleSheet, View } from "react-native";
// import { RadioButton, Text } from "react-native-paper";

// import { SelectedParserContext } from "../contexts/selectedParserContext";
// import { ParsersContext } from "../contexts/parsersContext";
// import { IsLoadingContext } from "../contexts/isLoadingContext";
// import { getAllParsers } from "../services/postService";

export default function ParserSelections() {
  // const [parsers, setParsers] = useContext(ParsersContext); // as GamesContextType (example), type is defined in context file;
  // const [selectedParser, setSelectedParser] = useContext(SelectedParserContext); // as GamesContextType (example), type is defined in context file;
  // const [isLoading, setIsLoading] = useContext(IsLoadingContext); // as GamesContextType (example), type is defined in context file;
  // const parsersList = parsers.map((parser) => (
  //   <View style={styles.parserSelection} key={parser.id}>
  //     <RadioButton
  //       value={parser.id}
  //       status={selectedParser.id === parser.id ? "checked" : "unchecked"}
  //       onPress={() => {
  //         setSelectedParser(parser);
  //       }}
  //     />
  //     <Text variant="labelMedium">{parser.name}</Text>
  //   </View>
  // ));
  // useEffect(() => {
  //   let isMounted = true;
  //   (async () => {
  //     if (!isMounted) {
  //       return;
  //     }
  //     try {
  //       setIsLoading(true);
  //       const result = await getAllParsers();
  //       setParsers(result);
  //       setSelectedParser(
  //         result.length ? (selectedParser ? selectedParser : result[0]) : null,
  //       );
  //       setIsLoading(false);
  //     } catch (err) {
  //       alert(err);
  //       console.error(err);
  //       setIsLoading(false);
  //     }
  //   })();
  //   return () => {
  //     isMounted = false;
  //   };
  // }, []);
  // return <View style={styles.parsersList}>{parsersList}</View>;
}

const styles = StyleSheet.create({
  // parsersList: {
  //   alignItems: "flex-start",
  // },
  // parserSelection: {
  //   flexDirection: "row",
  // },
});
