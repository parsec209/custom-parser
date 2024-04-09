import { useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import { Divider, Text, IconButton, Button } from "react-native-paper";
import { Link } from "expo-router";

import * as ImagePicker from "expo-image-picker";

//import { Icon } from "@expo/vector-icons";

//import { Text, View } from "@/components/Themed";

export default function ScannerPage() {
  const [selectedImage1, setSelectedImage1] = useState(null);
  const [selectedImage2, setSelectedImage2] = useState(null);

  const [status, requestPermission] = ImagePicker.useCameraPermissions();

  const pickImage = async (imageNumber) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      imageNumber === 1
        ? setSelectedImage1(result.assets[0].uri)
        : setSelectedImage2(result.assets[0].uri);
    } else {
      alert("No image selected");
    }
  };

  const takePhoto = async (imageNumber) => {
    const pendingResult = await ImagePicker.getPendingResultAsync();
    if (pendingResult && pendingResult.length > 0) {
      console.log(pendingResult);
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      imageNumber === 1
        ? setSelectedImage1(result.assets[0].uri)
        : setSelectedImage2(result.assets[0].uri);
    } else {
      alert("No image selected");
    }
  };

  if (status === null) {
    requestPermission();
  }

  return (
    <View style={styles.container}>
      <Text variant="bodyMedium">Scan up to two images.</Text>
      <Text variant="bodyMedium">Use camera or photo library.</Text>
      <Divider bold style={styles.divider} />
      <View style={styles.imagesContainer}>
        <View>
          <View style={styles.imageContainer}>
            {selectedImage1 ? (
              <Image source={{ uri: selectedImage1 }} style={styles.image} />
            ) : (
              <View style={styles.imageIconContainer}>
                <IconButton
                  icon="camera"
                  iconColor="black"
                  size={40}
                  onPress={() => takePhoto(1)}
                />
                <IconButton
                  icon="upload"
                  iconColor="black"
                  size={40}
                  onPress={() => pickImage(1)}
                />
              </View>
            )}
          </View>
          {
            <Button
              mode="text"
              style={selectedImage1 ? { opacity: 1 } : { opacity: 0 }}
              onPress={() => setSelectedImage1(null)}
              disabled={!selectedImage1}
            >
              Reset
            </Button>
          }
        </View>
        <View>
          <View style={styles.imageContainer}>
            {selectedImage2 ? (
              <Image source={{ uri: selectedImage2 }} style={styles.image} />
            ) : (
              <View style={styles.imageIconContainer}>
                <IconButton
                  icon="camera"
                  iconColor="black"
                  size={40}
                  onPress={() => takePhoto(2)}
                />
                <IconButton
                  icon="upload"
                  iconColor="black"
                  size={40}
                  onPress={() => pickImage(2)}
                />
              </View>
            )}
          </View>
          <Button
            mode="text"
            style={selectedImage2 ? { opacity: 1 } : { opacity: 0 }}
            onPress={() => setSelectedImage2(null)}
            disabled={!selectedImage2}
          >
            Reset
          </Button>
        </View>
      </View>

      <Button
        mode="contained"
        buttonColor="blue"
        //disabled={!selectedImage1 && !selectedImage2}
        onPress={() => {}}
      >
        {/* {!selectedImage1 && !selectedImage2 && "Scan"}
        {(selectedImage1 || selectedImage2) && ( */}
          <Link href="../parsers">Select parser</Link>
        {/* )} */}
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
  imagesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  imageContainer: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgray",
    marginHorizontal: 10,
  },
  imageIconContainer: {
    flexDirection: "row",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover", // Adjust as needed
  },
  scanButton: {
    marginVertical: 30,
  },
});

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   Image,
//   StyleSheet,
//   Picker,
// } from "react-native";

// const App: React.FC = () => {
//   const [account, setAccount] = useState<string>("");
//   const [amount, setAmount] = useState<string>("");

//   return (
//     <View style={styles.container}>

//       <View style={styles.checkImages}>
//         <Image
//           source={{ uri: "path-to-front-check-image" }}
//           style={styles.checkImage}
//         />
//         <Text>Front of Check</Text>
//         <Image
//           source={{ uri: "path-to-back-check-image" }}
//           style={styles.checkImage}
//         />
//         <Text>Back of Check</Text>
//       </View>

//       <Text style={styles.label}>Deposit to</Text>
//       <Picker
//         selectedValue={account}
//         onValueChange={(itemValue) => setAccount(itemValue)}
//         style={styles.picker}
//       >
//         {/* Picker items for account selection */}
//       </Picker>
//       <TextInput
//         placeholder="$0.00"
//         value={amount}
//         onChangeText={(text) => setAmount(text)}
//         keyboardType="numeric"
//         style={styles.input}
//       />
//       <View style={styles.buttonContainer}>
//         <Button title="Cancel" onPress={() => {}} />
//         <Button title="Next" onPress={() => {}} />
//       </View>
//       <Text style={styles.disclosure}>
//         Investing involves risk. There is always the potential of losing money
//         when you invest in securities.
//       </Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   topBar: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     // Add styles for top bar
//   },
//   instructions: {
//     // Add styles for instructions text
//   },

//   checkImage: {
//     // Add styles for check images
//   },
//   label: {
//     // Add styles for labels
//   },
//   picker: {
//     // Add styles for picker
//   },
//   input: {
//     borderBottomWidth: 1,
//     // Add styles for input field
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     // Add styles for button container
//   },
//   disclosure: {
//     // Add styles for disclosure text
//   },
// });

// export default App;
