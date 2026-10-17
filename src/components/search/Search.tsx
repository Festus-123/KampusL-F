import React from "react";
import { Text, TextInput, View } from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";

const Search = () => {
  return (
    <View className="relative flex-1 p-4 py-8 items-center">

        {/* Header */}
        <Text className="text-brand text-center text-4xl">Search</Text>

        {/* Search result */}
        <View className="bg-brand min-h-20 p-4 w-full rounded-xl mt-4">

        </View>

        {/* search bar */}
      <View className="absolute bottom-20 w-full border rounded-xl flex flex-row items-center p-2">
          <EvilIcons name="search" size={24} color="black" className=""/>
        <TextInput
          placeholder="Search item..."
          className="w-full p-2"
        />
      </View>
    </View>
  );
};

export default Search;
