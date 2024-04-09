import FontAwesome from "@expo/vector-icons/FontAwesome";
//import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import * as SQLite from "expo-sqlite";


//import { useColorScheme } from '@/components/useColorScheme';

export const db = SQLite.openDatabase("db.db");
 

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists parsers (id integer primary key not null, name text unique, fields text, prompts text);");
      });
    }, []);

  if (!loaded) {
    return null;
  }

  return (
    // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <PaperProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="parsers" options={{ presentation: "modal", title: "Parser selection" }} />
        <Stack.Screen name="parser" options={{ presentation: "modal", title: "Parser setup" }} />
      </Stack>
      {/* </ThemeProvider> */}
    </PaperProvider>
  );
}


