import AuthProvider from "@/context/auth/AuthProvider";
import ItemsProvider from "@/context/items/ItemsProvider";
import RequestProvider from "@/context/requests/RequestProvider";
import RootNavigation from "@/lib/navigation/RootNavigation";
import Toast from "react-native-toast-message";
import "./global.css";



export default function RootLayout() {
  return (
    <AuthProvider>
      <ItemsProvider>
        <RequestProvider>
          <RootNavigation />
          <Toast />
        </RequestProvider>
      </ItemsProvider>
    </AuthProvider>
  );
}
