import { useContext, useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Divider, Text, Button } from "react-native-paper";
import { Link } from "expo-router";

import ImageSelection from "../../components/ImageSelection";
import {
  deleteAll,
  dropParsersTable,
  dropParsersDataTable,
} from "../../services/postService";
import { SelectedImagesContext } from "../../contexts/selectedImagesContext";

export default function ScannerTab() {
  const { selectedImages, setSelectedImages } = useContext(
    SelectedImagesContext,
  ); // as GamesContextType (example), type is defined in context file;

  //console.log(selectedImages)

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);

  const updateSelectedImages = () => {
    const updatedSelectedImages = [...selectedImages];
    updatedSelectedImages[0] = image1;
    updatedSelectedImages[1] = image2;
    setSelectedImages(updatedSelectedImages);
  };

  const handleImage1Update = (image) => {
    setImage1(image);
  };

  const handleImage2Update = (image) => {
    setImage2(image);
  };

  const deleteAllRecords = async () => {
    try {
      await deleteAll();
    } catch (err) {
      alert(err);
      console.error(err);
    }
  };

  const dropAllTables = async () => {
    try {
      await dropParsersTable();
      await dropParsersDataTable();
    } catch (err) {
      alert(err);
      console.error(err);
    }
  };

  useEffect(() => {
    updateSelectedImages();
  }, [image1, image2]);

  return (
    <View style={styles.container}>
      <Text variant="bodyMedium">Select one to two images per scan.</Text>
      <Text variant="bodyMedium">Use camera or photo library.</Text>
      <Divider bold style={styles.divider} />

      <View style={styles.imageSelections}>
        <ImageSelection image={image1} handleImageUpdate={handleImage1Update} />
        <ImageSelection image={image2} handleImageUpdate={handleImage2Update} />
      </View>

      <Button
        mode="contained"
        buttonColor="blue"
        disabled={!selectedImages[0] && !selectedImages[1]}
        onPress={() => {}}
      >
        <Link href="../parsersModal">Select parser</Link>
      </Button>


      <Button
        mode="text"
        buttonColor="red"
        onPress={deleteAllRecords}
        // disabled={!parsers?.length || isLoading}
      >
        Delete All Records
      </Button>
      <Button mode="text" buttonColor="red" onPress={dropAllTables}>
        Drop All Tables
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
