import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-900">
      <Text className="text-[5rem] font-medium text-white text-center">Hello! Lost an item?.</Text>
      <TouchableOpacity className="bg-green-500 p-4 rounded-xl w-75">
        <Text className="text-whte text-xl tracking-widest">CLick Me</Text>
      </TouchableOpacity>
    </View>
  );
}


