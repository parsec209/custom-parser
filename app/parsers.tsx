import { useState, useContext, useEffect } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { Text, Button, RadioButton } from "react-native-paper";
import { Link } from "expo-router";

import { SelectedParserContext } from "../contexts/selectedParserContext";
import { IsLoadingContext } from "../contexts/isLoadingContext";
import { ParsersContext } from "../contexts/parsersContext";
import {
  getAllImagesData,
  getAllParsers,
  deleteAll,
  dropAll,
  deleteParser,
} from "../services/postService";

export default function ParserSelectionModal() {
  const [selectedParser, setSelectedParser] = useContext(SelectedParserContext); // as GamesContextType (example), type is defined in context file;
  const [parsers, setParsers] = useContext(ParsersContext); // as GamesContextType (example), type is defined in context file;
  const [isLoading, setIsLoading] = useContext(IsLoadingContext);
  const [imagesData, setImagesData] = useState([]);

  const createTwoButtonAlert = () =>
    Alert.alert(
      "Warning",
      `This will also permanently delete this parser's scanned image data table. Please check out the data export options first. If you still want to proceed with deletion, click OK.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            deleteParser(selectedParser.id);
          },
        },
      ],
    );

  const parsersList = parsers.map((parser) => (
    <View style={styles.parserSelection} key={parser.id}>
      <RadioButton
        value={parser.id}
        status={selectedParser.id === parser.id ? "checked" : "unchecked"}
        onPress={() => {
          setSelectedParser(parser);
        }}
      />
      <Text variant="labelMedium">{parser.name}</Text>
    </View>
  ));

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

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!isMounted) {
        return;
      }
      try {
        setIsLoading(true);
        const result = await getAllParsers();
        setParsers(result);
        setSelectedParser(
          result.length ? (selectedParser ? selectedParser : result[0]) : null,
        );
        setIsLoading(false);
      } catch (err) {
        alert(err);
        console.error(err);
        setIsLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={[styles.container, { opacity: isLoading ? 0.5 : 1 }]}>
      <Text style={styles.title} variant="headlineMedium">
        Select a parser
      </Text>
      <View style={styles.parsersList}>{parsersList}</View>
      <Button icon="plus" mode="text" disabled={isLoading} onPress={() => {}}>
        <Link href="./parser">Add new parser</Link>
      </Button>
      {parsers.length && (
        <>
          <Button
            icon="pencil-outline"
            mode="text"
            disabled={isLoading}
            onPress={() => {}}
          >
            <Link href={`./parser?id=${selectedParser.id}`}>
              Edit selected parser
            </Link>
          </Button>
          <Button
            mode="text"
            buttonColor="red"
            onPress={createTwoButtonAlert}
            disabled={isLoading}
          >
            Delete selected parser
          </Button>
        </>
      )}
      <Button
        style={styles.scanButton}
        icon="scan-helper"
        mode="contained"
        buttonColor="blue"
        onPress={scan}
        disabled={!parsers.length || isLoading}
      >
        Start scan
      </Button>
      <Button
        mode="text"
        buttonColor="red"
        onPress={deleteAll}
        disabled={!parsers.length || isLoading}
      >
        Delete All Parsers
      </Button>
      <Button
        mode="text"
        buttonColor="red"
        onPress={dropAll}
        disabled={isLoading}
      >
        Drop All SQL Tables
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
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginVertical: 20,
  },
  parsersList: {
    alignItems: "flex-start",
  },
  parserSelection: {
    flexDirection: "row",
  },

  scanButton: {
    marginVertical: 20,
  },
});
