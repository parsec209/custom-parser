import { useEffect, useState, useContext } from "react";
import { StyleSheet, View } from "react-native";
import { Text, Button, RadioButton } from "react-native-paper";
import { Link } from "expo-router";

import { SelectedImageDataContext } from "../contexts/selectedImageDataContext";
import { ImagesDataContext } from "../contexts/imagesDataContext";
import { getAllImagesData } from "../services/postService";

export default function ImageDataSelections() {
  const { imagesData, setImagesData } = useContext(ImagesDataContext);
  const { selectedImageData, setSelectedImageData } = useContext(
    SelectedImageDataContext,
  );
  const [isLoading, setIsLoading] = useState(false);

  const getAndSetImagesData = async () => {
    try {
      setIsLoading(true);
      const result = await getAllImagesData();
      setImagesData(result);
      setSelectedImageData(
        result.length
          ? selectedImageData
            ? selectedImageData
            : result[0]
          : null,
      );
      setIsLoading(false);
    } catch (err) {
      alert(err);
      console.error(err);
      setIsLoading(false);
    }
  };

  const imageDataList = imagesData?.map((imageData) => (
    <View style={styles.imageDataSelection} key={imageData.id}>
      <RadioButton
        value={imageData.id}
        status={
          selectedImageData?.id === imageData.id ? "checked" : "unchecked"
        }
        onPress={() => {
          setSelectedImageData(imageData);
        }}
        disabled={isLoading}
      />
      <Text variant="titleMedium">{imageData.name}</Text>
    </View>
  ));

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!isMounted) {
        return;
      }
      await getAndSetImagesData();
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={[styles.container, { opacity: isLoading ? 0.5 : 1 }]}>
      <Text style={styles.title} variant="headlineMedium">
        Select a table
      </Text>
      <View style={styles.imageDataList}>{imageDataList}</View>
      {imagesData?.length > 0 && (
        <View>
          <Button
            icon="pencil-outline"
            mode="text"
            disabled={isLoading}
            onPress={() => {}}
          >
            <Link
              href={{
                pathname: `../image-data-modal`,
                params: {
                  id: selectedImageData?.id,
                },
              }}
            >
              Edit selected table
            </Link>
          </Button>
        </View>
      )}
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
  imageDataList: {
    alignItems: "flex-start",
  },
  imageDataSelection: {
    flexDirection: "row",
  },
});
