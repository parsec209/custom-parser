import { useContext } from "react";

import { StyleSheet, View } from "react-native";
import { Divider, Text, Button } from "react-native-paper";
import { Link } from "expo-router";

import ImageSelection from "../../components/ImageSelection";
import { deleteAll, dropParsersTable, dropImagesDataTable } from "../../services/postService";
import { ParsersContext } from "../../contexts/parsersContext";
import { SelectedParserContext } from "../../contexts/selectedParserContext";
import { ImagesDataContext } from "../../contexts/imagesDataContext";
import { SelectedImageDataContext } from "../../contexts/selectedImageDataContext";

export default function ScannerTab() {
  const { parsers, setParsers } = useContext(ParsersContext);
  const { selectedParser, setSelectedParser } = useContext(
    SelectedParserContext,
  );
  const { imagesData, setImagesData } = useContext(ImagesDataContext);
  const { selectedImageData, setSelectedImageData } = useContext(
    SelectedImageDataContext,
  );

  const deleteAllAndSetParsers = async () => {
    try {
      await deleteAll();
      setParsers([]);
      setImagesData([]);
      setSelectedParser(null);
      setSelectedImageData(null);
    } catch (err) {
      alert(err);
      console.error(err);
    }
  };

  const dropAllDB = async () => {
    try {
      await dropAll();
      setParsers([]);
      setImagesData([]);
      setSelectedParser(null);
      setSelectedImageData(null);
    } catch (err) {
      alert(err);
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="bodyMedium">Select up to two images per scan.</Text>
      <Text variant="bodyMedium">Use camera or photo library.</Text>
      <Divider bold style={styles.divider} />

      <View style={styles.imageSelections}>
        <ImageSelection selectedImagesIndex={0} />
        <ImageSelection selectedImagesIndex={1} />
      </View>

      <Button
        mode="contained"
        buttonColor="blue"
        //disabled={!selectedImages[0] && !selectedImage2}
        onPress={() => {}}
      >
        <Link href="../parsers-modal">Select parser</Link>
      </Button>

      <Button
        mode="text"
        buttonColor="red"
        onPress={deleteAllAndSetParsers}
        // disabled={!parsers?.length || isLoading}
      >
        Delete All Parsers
      </Button>
      <Button mode="text" buttonColor="red" onPress={dropParsersTable}>
        Drop parsers Table
      </Button>
      <Button mode="text" buttonColor="red" onPress={dropImagesDataTable}>
        Drop images_data table
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
  divider: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  imageSelections: {
    flexDirection: "row",
    alignItems: "center",
  },
});
