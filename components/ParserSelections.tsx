import { useState, useContext, useCallback } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Text, Button, RadioButton } from "react-native-paper";
import { Link, usePathname } from "expo-router";

import { SelectedImagesContext } from "../contexts/selectedImagesContext";
import { getAllParsers, deleteParser } from "../services/postService";

export default function ParserSelections() {
  const currentPath = usePathname();

  const { selectedImages } = useContext(SelectedImagesContext);

  const [parsers, setParsers] = useState([]);
  const [selectedParserIndex, setSelectedParserIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  //   const scan = async () => {
  //     try {
  //       //send inner array string subsection of selectedParser.prompts, and selectedImages, to backend
  //       //backend returns stringified array of string values
  //       const stringifiedValues = `['a', 'b', 'c']`;
  //       // ['d', 'e', 'f']
  //       // ['g', 'h', 'i']
  //       const parsedValues = JSON.parse(stringifiedValues);
  //       const values = parsedValues.map((value) =>
  //         typeof value !== "string" ? "" : value,
  //       ); // only for testing, allow null and undefined for cell values
  //       const imageData = await getImageData(
  //         { parserId: parsers[selectedParserIndex].id}
  //       );
  //       const imageDataUpdatedRows = imageData.data.push(values);
  //       await updateImageData({
  //         name: imageData.name,
  //         fieldNames
  // : imageData.fields,
  // rows: imageDataUpdatedRows,
  // id: imageData.id,
  //     });
  //       router.replace(`./table-modal?id=${imageData.id}`);
  //     } catch (err) {
  //       alert(err);
  //       console.error(err);
  //     }
  //   };

  const deleteOneAndSetParsers = async (id) => {
    try {
      setIsLoading(true);
      await deleteParser(id);
      const updatedParsers = parsers.filter((parser) => parser.id != id);
      setParsers(updatedParsers);
      setSelectedParserIndex(0);
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
      `This will also permanently delete this parser's image data table. Please check out the data export options first. If you still want to proceed with deletion, click OK.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            deleteOneAndSetParsers(parsers[selectedParserIndex].id);
          },
        },
      ],
    );

  const parsersList = parsers?.map((parser, index) => (
    <View style={styles.parserSelection} key={parser.id}>
      <RadioButton
        value={parser.id}
        status={
          parsers && parsers[selectedParserIndex].id === parser.id
            ? "checked"
            : "unchecked"
        }
        onPress={() => {
          setSelectedParserIndex(index);
        }}
        disabled={isLoading}
      />
      <Text variant="titleMedium">{parser.name}</Text>
    </View>
  ));

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchParsers = async () => {
        try {
          setIsLoading(true);
          const result = await getAllParsers();
          if (isActive) {
            setParsers(result);
            setSelectedParserIndex(0);
          }
          setIsLoading(false);
        } catch (err) {
          alert(err);
          console.error(err);
          setIsLoading(false);
        }
      };
      fetchParsers();
      return () => {
        isActive = false;
      };
    }, []),
  );

  return (
    <View style={{ opacity: isLoading ? 0.5 : 1 }}>
      <View style={styles.title}>
        {parsers?.length === 0 ? (
          <Text variant="titleMedium">No parsers set up yet</Text>
        ) : (
          <Text variant="headlineMedium">Select a parser</Text>
        )}
      </View>
      <View style={styles.parsersList}>{parsersList}</View>
      {parsers?.length > 0 && (
        <View style={styles.parsersModificationButtons}>
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
                  parserId:
                    parsers?.length > 0
                      ? parsers[selectedParserIndex].id
                      : undefined,
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
      <View style={styles.parsersModificationButtons}>
        <Button icon="plus" mode="text" disabled={isLoading} onPress={() => {}}>
          <Link
            href={{
              pathname:
                currentPath === "/parsers-modal"
                  ? "./parser-modal"
                  : "../parser-modal",
            }}
          >
            Add new parser
          </Link>
        </Button>
      </View>
      {currentPath === "/parsers-modal" && (
        <Button
          style={styles.scanButton}
          icon="scan-helper"
          mode="contained"
          buttonColor="blue"
          // onPress={scan}
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
    marginBottom: 20,
    alignItems: "center",
  },
  parsersList: {
    alignItems: "flex-start",
    marginBottom: 20,
  },
  parserSelection: {
    flexDirection: "row",
  },
  parsersModificationButtons: {
    alignItems: "flex-start",
  },
  scanButton: {
    marginTop: 20,
  },
});
