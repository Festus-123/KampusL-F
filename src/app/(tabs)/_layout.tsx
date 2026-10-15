import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "black",
            tabBarActiveBackgroundColor: "#ffffff",
            tabBarStyle: { position: "absolute" },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              headerShown: false,
              title: "KampusLF",
              tabBarIcon: ({ color }) => (
                <FontAwesome size={28} name="home" color={color} />
              ),
            }}
          />
          <Tabs.Screen 
            name="add"
            options={{
              headerShown: false,
              title: "Add item",
              tabBarIcon: ({color}) => (
                <AntDesign name="appstore-add" size={24} color="black" />
              )
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
    </>
  );
}
