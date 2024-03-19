import { StyleSheet, View } from "react-native";
import { Divider, Text, Icon } from "react-native-paper";

//import { Icon } from "@expo/vector-icons";

//import { Text, View } from "@/components/Themed";

export default function Scanner() {
  return (
    <View style={styles.container}>
      <Text variant="bodyMedium">Scan up to two images</Text>
      <Divider />
      <View style={styles.imagesContainer}>
        <View style={styles.imageContainer}>
          <View style={styles.imageIconContainer}>
            <Icon source="camera" size={30} color="black" />
            <Icon source="upload" size={30} color="black" />
          </View>
        </View>
        <View style={styles.imageContainer}>
          <View style={styles.imageIconContainer}>
            <Icon source="camera" size={30} color="black" />
            <Icon source="upload" size={30} color="black" />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "80%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  // title: {
  //   fontSize: 20,
  //   fontWeight: "bold",
  // },
  // separator: {
  //   marginVertical: 30,
  //   height: 1,
  //   width: "80%",
  // },
  imagesContainer: {
    //width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: "black",
    flexDirection: "row",
    aspectRatio: 1,
    //alignItems: "center",
    justifyContent: "center",
    // width: "80%",
  },
  imageIconContainer: {
    flexDirection: "row",
    margin: 25,
    justifyContent: "space-between",
    width: "30%",
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
