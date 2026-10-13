import { Link } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

export default function AppTabs() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? "#020817" : "#f8fafc",
          borderColor: isDark ? "#1e293b" : "#e2e8f0",
        },
      ]}
    >
      <Link href="/" asChild>
        <Pressable
          style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
        >
          <Text
            style={[styles.label, { color: isDark ? "#f8fafc" : "#0f172a" }]}
          >
            Home
          </Text>
        </Pressable>
      </Link>

      <Link href="/explore" asChild>
        <Pressable
          style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
        >
          <Text
            style={[styles.label, { color: isDark ? "#f8fafc" : "#0f172a" }]}
          >
            Explore
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
});
