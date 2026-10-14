import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { BlurView } from "expo-blur";
import AuthProvider from "@/context/auth/AuthProvider";
import { useAuth } from "@/hooks/auth/useAuth";
import PopUps from "@/components/pop-up/PopUps";


export default function TabLayout() {
    const { user, isLoading } = useAuth();

  // if(isLoading){
    
  // }

  if (!user) {
    return (
      <PopUps
      message='You aren&apos;t signed in yet!, join this community to help items get recollected'
      isType='message'
      directTo='/(auths)/signup'
      buttonLabel='Signup'/>
    )
  }
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
