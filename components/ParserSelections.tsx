import { useState, useContext, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Text, Button, RadioButton, Portal, Dialog } from "react-native-paper";
import { Link, usePathname, useRouter } from "expo-router";

import { SelectedImagesContext } from "../contexts/selectedImagesContext";
import { getAllParsers, deleteParser } from "../services/postService";
import { scan } from "../services/scanner";

export default function ParserSelections() {
  const currentPath = usePathname();
  const router = useRouter();

  const { selectedImages, setSelectedImages } = useContext(SelectedImagesContext);
  const [parsers, setParsers] = useState([]);
  const [selectedParserIndex, setSelectedParserIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogIsVisible, setDialogIsVisible] = useState(false);

  const scanAndReroute = async () => {
    try {
      setIsLoading(true);
      const parserDataId = await scan(
        parsers[selectedParserIndex],
        selectedImages,
      );
      setSelectedImages([null, null])
      router.replace(
        `./parserDataModal?parserDataId=${parserDataId}&rowHighlighted=true`,
      );
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      if (err.response) {
        alert(err.response.data?.message);
      } else if (err.request) {
        alert("No response was received");
      } else {
        alert(err.message);
      }
    }
  };

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
                  currentPath === "/parsersModal"
                    ? `./parserModal`
                    : `../parserModal`,
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
            onPress={() => {
              setDialogIsVisible(true);
            }}
            disabled={isLoading}
          >
            Delete selected parser
          </Button>
          <Portal>
            <Dialog
              visible={dialogIsVisible}
              onDismiss={() => {
                setDialogIsVisible(false);
              }}
            >
              <Dialog.Content>
                <Text variant="bodyMedium">
                  This will also permanently delete this parser's data, click OK
                  to proceed.
                </Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  onPress={() => {
                    deleteOneAndSetParsers(parsers[selectedParserIndex].id);
                  }}
                >
                  OK
                </Button>
              </Dialog.Actions>
              <Dialog.Actions>
                <Button
                  onPress={() => {
                    setDialogIsVisible(false);
                  }}
                >
                  Cancel
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      )}
      <View style={styles.parsersModificationButtons}>
        <Button icon="plus" mode="text" disabled={isLoading} onPress={() => {}}>
          <Link
            href={{
              pathname:
                currentPath === "/parsersModal"
                  ? "./parserModal"
                  : "../parserModal",
            }}
          >
            Add new parser
          </Link>
        </Button>
      </View>
      {currentPath === "/parsersModal" && (
        <Button
          style={styles.scanButton}
          icon="scan-helper"
          mode="contained"
          buttonColor="blue"
          onPress={scanAndReroute}
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
