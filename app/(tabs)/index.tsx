import { StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
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
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Picker,
} from "react-native";

const App: React.FC = () => {
  const [account, setAccount] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>{/* Icons for menu and inbox */}</View>
      <Text style={styles.instructions}>
        Sign and write "for deposit only at Merrill" on the back of your check.
      </Text>
      <View style={styles.checkImages}>
        <Image
          source={{ uri: "path-to-front-check-image" }}
          style={styles.checkImage}
        />
        <Text>Front of Check</Text>
        <Image
          source={{ uri: "path-to-back-check-image" }}
          style={styles.checkImage}
        />
        <Text>Back of Check</Text>
      </View>
      <Text style={styles.label}>Deposit to</Text>
      <Picker
        selectedValue={account}
        onValueChange={(itemValue) => setAccount(itemValue)}
        style={styles.picker}
      >
        {/* Picker items for account selection */}
      </Picker>
      <TextInput
        placeholder="$0.00"
        value={amount}
        onChangeText={(text) => setAmount(text)}
        keyboardType="numeric"
        style={styles.input}
      />
      <View style={styles.buttonContainer}>
        <Button title="Cancel" onPress={() => {}} />
        <Button title="Next" onPress={() => {}} />
      </View>
      <Text style={styles.disclosure}>
        Investing involves risk. There is always the potential of losing money
        when you invest in securities.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // Add styles for top bar
  },
  instructions: {
    // Add styles for instructions text
  },
  checkImages: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    // Add styles for check images container
  },
  checkImage: {
    // Add styles for check images
  },
  label: {
    // Add styles for labels
  },
  picker: {
    // Add styles for picker
  },
  input: {
    borderBottomWidth: 1,
    // Add styles for input field
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // Add styles for button container
  },
  disclosure: {
    // Add styles for disclosure text
  },
});

export default App;
