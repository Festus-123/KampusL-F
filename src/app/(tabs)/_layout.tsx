import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "black",
        tabBarActiveBackgroundColor: "#85d5fb",
        tabBarStyle: { position: 'absolute'},
        tabBarBackground: () => (
          <BlurView tint="light" intensity={10} className="h-full "/>
        )
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "KampusLF",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="search" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
