import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { View, Text, TouchableOpacity } from "react-native";

const HeaderBadge = () => {
  return (
    <View className="p-4 w-max flex flex-row justify-between ">
    <Text className="text-[2rem] font-sans font-extrabold ">
      KampusL&F
    </Text>
    <TouchableOpacity className='relative'>

    <Link href="/">
      <Ionicons 
        name='person-circle-outline' size={28} color="black" className=''/>
    </Link>
      <View className='w-3 h-3 bg-brand rounded-full absolute top-0 right-0'/>
        </TouchableOpacity>
    </View>
  );
};

export default HeaderBadge;
