import React from "react";
//import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Icon } from "react-native-paper";

import { Link, Tabs } from "expo-router";
//import { Pressable } from 'react-native';

// import Colors from '@/constants/Colors';
// import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
// function TabBarIcon(props: {
//   name: React.ComponentProps<typeof FontAwesome>['name'];
//   color: string;
// }) {
//   return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
// }

export default function TabLayout() {
  //const colorScheme = useColorScheme();

  return (
    <Tabs
    // screenOptions={{
    //   tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
    //   // Disable the static render of the header on web
    //   // to prevent a hydration error in React Navigation v6.
    //   headerShown: useClientOnlyValue(false, true),
    // }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Scanner",
          //tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          tabBarIcon: ({ color }) => (
            <Icon source="scan-helper" color={color} size={20} />
          ),

          // headerRight: () => (
          //   <Link href="/modal" asChild>
          //     <Pressable>
          //       {({ pressed }) => (
          //         <FontAwesome
          //           name="info-circle"
          //           size={25}
          //           color={Colors[colorScheme ?? 'light'].text}
          //           style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
          //         />
          //       )}
          //     </Pressable>
          //   </Link>
          // ),
        }}
      />
      <Tabs.Screen
        name="tables"
        options={{
          title: "Tables",
          //tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          tabBarIcon: ({ color }) => (
            <Icon source="table" color={color} size={20} />
          ),
        }}
      />
    </Tabs>
  );
}
