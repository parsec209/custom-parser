import { useState, useContext } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";

import { SelectedParserContext } from "../contexts/selectedParserContext";
import { IsLoadingContext } from "../contexts/isLoadingContext";
import { ParsersContext } from "../contexts/parsersContext";
import { getAllImagesData } from "../services/postService";
import ParserSelections from "../components/ParserSelections";

export default function ParsersModal() {
  const {selectedParser, setSelectedParser} = useContext(SelectedParserContext); // as GamesContextType (example), type is defined in context file;
  const {parsers, setParsers} = useContext(ParsersContext); // as GamesContextType (example), type is defined in context file;
  const {isLoading, setIsLoading} = useContext(IsLoadingContext);
  const [imagesData, setImagesData] = useState([]);

  const scan = async () => {
    //   try {
    // const result = await getAllImagesData();
    // setImagesData(result);
    //     const imageData = imagesData.filter((imageData) => imageData.parser_id === checked);
    //     const parser = parsers.filter((parser) => parser.id === checked);
    //     //send stringified parsers.rows[0] to backend
    //     //backend returns stringified array of string values
    //     const values = []
    //     const newTableRow = [];
    //     const tableFieldNames = table.fields
    //     for (let i = 0; i < values.length; i++) {
    //       let value = values[i]
    //       for (let j = 0; j < tableFieldNames.length; j++) {
    //         let tableFieldName = tableFieldNames[j]
    //         if (condition) {
    //           const element = array[index];
    //           const element = array[index];
    //         }
    //       }
    //       for
    //     }
    //   } catch (err) {
    //     alert(err);
    //     console.error(err);
    //   }
  };

  return (
    <View style={[styles.container, { opacity: isLoading ? 0.5 : 1 }]}>
      <ParserSelections />
      <Button
        style={styles.scanButton}
        icon="scan-helper"
        mode="contained"
        buttonColor="blue"
        onPress={scan}
        disabled={!parsers?.length || isLoading}
      >
        Start scan
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
  scanButton: {
    marginVertical: 20,
  },
});
