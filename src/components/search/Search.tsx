import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import ItemsDisplay from "../items-display/ItemsDisplay";
import { SafeAreaView } from "react-native-safe-area-context";

const Search = () => {
  const [searchWord, setSearchWord] = useState("");
  const [searchCount, setSearchCount] = useState(0);

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
        className="flex-1 relative p-2"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View className="flex-1 p-2 w-full">
          <View className="w-full">
            {/* Header */}
            <Text className="text-brand text-center text-4xl">Search</Text>

            {/* Search result */}
            <View className="bg-brand min-h-20 p-4 w-full rounded-xl mt-4 items-start justify-center">
              <Text className="tet-2xl">Search results: {searchCount}</Text>
            </View>
          </View>

          <View className="flex-1 my-4">
            {/* Search list */}
            <ItemsDisplay
              mode="search"
              searchWord={searchWord}
              onSearchCountChange={setSearchCount}
            />
          </View>
        </View>

        {/* search bar */}
        <View className="w-full z-30 border rounded-xl flex flex-row items-center p-2 mb-10 bg-white/50 backdrop-blur-md">
          <EvilIcons name="search" size={24} color="black" className="" />
          <TextInput
            placeholder="Search item..."
            className="w-full p-2"
            value={searchWord}
            onChangeText={setSearchWord}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Search;
