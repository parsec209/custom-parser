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
        name="tables"
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
