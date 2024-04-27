import { useContext, useEffect } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { Text, Button, RadioButton } from "react-native-paper";
import { Link } from "expo-router";

import { SelectedParserContext } from "../contexts/selectedParserContext";
import { IsLoadingContext } from "../contexts/isLoadingContext";
import { ParsersContext } from "../contexts/parsersContext";
import {
  getAllParsers,
  deleteAll,
  dropAll,
  deleteParser,
} from "../services/postService";

export default function ParserSelections() {
  const { selectedParser, setSelectedParser } = useContext(
    SelectedParserContext,
  ); // as GamesContextType (example), type is defined in context file;
  const { parsers, setParsers } = useContext(ParsersContext); // as GamesContextType (example), type is defined in context file;
  const { isLoading, setIsLoading } = useContext(IsLoadingContext);

  const getAndSetParsers = async () => {
    try {
      setIsLoading(true);
      const result = await getAllParsers();
      setParsers(result);
      setSelectedParser(
        result?.length ? (selectedParser ? selectedParser : result[0]) : null,
      );
      setIsLoading(false);
    } catch (err) {
      alert(err);
      console.error(err);
      setIsLoading(false);
    }
  };

  const deleteAllAndSetParsers = async () => {
    try {
      setIsLoading(true);
      await deleteAll();
      setParsers([]);
      setSelectedParser(null);
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
      setSelectedParser(null);
      setIsLoading(false);
    } catch (err) {
      alert(err);
      console.error(err);
      setIsLoading(false);
    }
  };

  const dropAllDB = async () => {
    try {
      setIsLoading(true);
      await dropAll();
      setParsers([]);
      setSelectedParser(null);
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
      <Text variant="labelMedium">{parser.name}</Text>
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
    <View style={[styles.container, { opacity: isLoading ? 0.5 : 1 }]}>
      <Text style={styles.title} variant="headlineMedium">
        Select a parser
      </Text>
      <View style={styles.parsersList}>{parsersList}</View>
      <Button icon="plus" mode="text" disabled={isLoading} onPress={() => {}}>
        <Link href="./parser">Add new parser</Link>
      </Button>
      {/* {parsers?.length && (
        <>
          <Button
            icon="pencil-outline"
            mode="text"
            disabled={isLoading}
            onPress={() => {}}
          >
            <Link href={`./parser?id=${selectedParser?.id}`}>
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
      )} */}
      <Button
        mode="text"
        buttonColor="red"
        onPress={deleteAllAndSetParsers}
        disabled={!parsers?.length || isLoading}
      >
        Delete All Parsers
      </Button>
      <Button
        mode="text"
        buttonColor="red"
        onPress={dropAllDB}
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
});
