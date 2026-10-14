import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ExternalPathString, Link, RelativePathString } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native'

type POPUPS = {
    message: string;
    buttonLabel: string;
    isType: "error" | "message" | "warning";
    directTo: RelativePathString | ExternalPathString | "/(auths)/signup";
}

const PopUps = ({message, buttonLabel, isType, directTo}: POPUPS) => {
  return (
    <View className='bg-secondary rounded-t-2xl p-2 flex flex-1 flex-col gap-6 items-center absolute bottom-0 pt-16 pb-24'>

    { isType === "message" ? (
        <AntDesign name='message' size={42} color='black'/>
    ): isType === "warning" ? (
        <AntDesign name='warning' size={42} color='black'/>
    ): (
        <MaterialIcons name="error-outline" size={42} color="black" />
    )}


    <Text className='font-light text-xl tracking-widest text-center'>
        {message}
    </Text>

    <Link href={directTo} asChild>
    <TouchableOpacity className='bg-brand p-4 rounded-xl flex items-center justify-center w-full border-[0.5]'>
        <Text>{buttonLabel}</Text>
    </TouchableOpacity>
    </Link>

    </View>
  )
}

export default PopUps
