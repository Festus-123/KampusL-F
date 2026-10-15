import AuthProvider from "@/context/auth/AuthProvider";
import ItemsProvider from "@/context/items/ItemsProvider";
import RootNavigation from "@/lib/navigation/RootNavigation";
import Toast from "react-native-toast-message";
import "./global.css";



export default function RootLayout() {
  return (
    <AuthProvider>
      <ItemsProvider>
        <RootNavigation />
        <Toast />
      </ItemsProvider>
    </AuthProvider>
  );
}
