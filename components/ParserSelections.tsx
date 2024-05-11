import { useEffect, useState, useContext } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { Text, Button, RadioButton } from "react-native-paper";
import { Link } from "expo-router";
import { usePathname } from "expo-router";

import { ParsersContext } from "../contexts/parsersContext";
import { SelectedParserContext } from "../contexts/selectedParserContext";
import { SelectedImagesContext } from "../contexts/selectedImagesContext";
import {
  getAllParsers,
  deleteParser,
  getImageData,
  updateImageData,
  // getAllImagesData,
} from "../services/postService";

export default function ParserSelections() {
  const currentPath = usePathname();
  //console.log(currentPath);

  const { parsers, setParsers } = useContext(ParsersContext);
  const { selectedParser, setSelectedParser } = useContext(
    SelectedParserContext,
  );
  const { selectedImages } = useContext(SelectedImagesContext);
  const [isLoading, setIsLoading] = useState(false);
  // const [imagesData, setImagesData] = useState([]);

  const scan = async () => {
    try {
      //send inner array string subsection of selectedParser.prompts, and selectedImages, to backend
      //backend returns stringified array of string values
      const stringifiedValues  = `['a', 'b', 'c']`
      // ['d', 'e', 'f']
      // ['g', 'h', 'i']
      const parsedValues = JSON.parse(stringifiedValues)
      const values = parsedValues.map((value) =>
        typeof value !== "string" ? "" : value,
      ); // only for testing, allow null and undefined for cell values
      const imageData = await getImageData(selectedParser.id, true);
      const imageDataUpdatedRows = imageData.data.push(values);
      await updateImageData(
        imageData.name,
        imageData.fields,
        imageDataUpdatedRows,
        imageData.id,
      );
      router.replace(`./table-modal?id=${imageData.id}`);
    } catch (err) {
      alert(err);
      console.error(err);
    }
  };

  const getAndSetParsers = async () => {
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
  };



  const deleteOneAndSetParsers = async (id) => {
    try {
      setIsLoading(true);
      await deleteParser(id);
      const updatedParsers = parsers.filter((parser) => parser.id != id);
      setParsers(updatedParsers);
      setSelectedParser(parsers.length ? parsers[0] : null);
      setIsLoading(false);
    } catch (err) {
      alert(err);
      console.error(err);
      setIsLoading(false);
    }
  };



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
            deleteOneAndSetParsers(selectedParser.id);
          },
        },
      ],
    );

  const parsersList = parsers?.map((parser) => (
    <View style={styles.parserSelection} key={parser.id}>
      <RadioButton
        value={parser.id}
        status={selectedParser?.id === parser.id ? "checked" : "unchecked"}
        onPress={() => {
          setSelectedParser(parser);
        }}
        disabled={isLoading}
      />
      <Text variant="titleMedium">{parser.name}</Text>
    </View>
  ));

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!isMounted) {
        return;
      }
      await getAndSetParsers();
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={{ opacity: isLoading ? 0.5 : 1 }}>
      <Text style={styles.title} variant="headlineMedium">
        Select a parser
      </Text>
      <View style={styles.parsersList}>{parsersList}</View>
      {parsers?.length > 0 && (
        <View>
          <Button
            icon="pencil-outline"
            mode="text"
            disabled={isLoading}
            onPress={() => {}}
          >
            <Link
              href={{
                pathname:
                  currentPath === "/parsers-modal"
                    ? `./parser-modal`
                    : `../parser-modal`,
                params: {
                  id: selectedParser?.id,
                },
              }}
            >
              Edit selected parser
            </Link>
          </Button>
          <Button
            icon="minus"
            mode="text"
            onPress={createTwoButtonAlert}
            disabled={isLoading}
          >
            Delete selected parser
          </Button>
        </View>
      )}
      <Button icon="plus" mode="text" disabled={isLoading} onPress={() => {}}>
        <Link
          href={{
            pathname:
              currentPath === "/parsers-modal"
                ? "./parser-modal"
                : "../parser-modal",
            // params: {
            //   routerPath:
            //     currentPath === "/parsers-modal" ? "./parsers-modal" : "../parsers-modal",
            // },
          }}
        >
          Add new parser
        </Link>
      </Button>


      {currentPath === "/parsers-modal" && (
        <Button
          style={styles.scanButton}
          icon="scan-helper"
          mode="contained"
          buttonColor="blue"
          onPress={scan}
          disabled={!(parsers?.length > 0) || isLoading}
        >
          Start scan
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
