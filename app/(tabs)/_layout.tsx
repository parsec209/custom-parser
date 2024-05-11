import React from "react";
import { Icon } from "react-native-paper";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Scanner",
          tabBarIcon: ({ color }) => (
            <Icon source="scan-helper" color={color} size={20} />
          ),
        }}
      />
      <Tabs.Screen
        name="parsers"
        options={{
          title: "Parsers",
          tabBarIcon: ({ color }) => (
            <Icon source="cog-outline" color={color} size={20} />
          ),
        }}
      />
      <Tabs.Screen
        name="images-data"
        options={{
          title: "Tables",
          tabBarIcon: ({ color }) => (
            <Icon source="table" color={color} size={20} />
          ),
        }}
      />
    </Tabs>
  );
}
