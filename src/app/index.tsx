import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const OnboardingScreen = () => {
  return (
    <View className="flex-1 bg-secondary px-6 pb-10 pt-16">
      <View className="flex-1 justify-center">
        {/* Large Illustration / Icon Container */}
        <View className="mb-8 items-center">
          <View className="relative h-32 w-32 items-center justify-center rounded-3xl border-2 border-brand bg-secondary shadow-sm">
            {/* Subtle background accent ring */}
            <View className="absolute inset-2 rounded-2xl bg-brand/10 p-4" />
            <MaterialCommunityIcons
              name="cube-scan"
              size={84}
              color={"#85d5fb"}
              className="text-brand"
            />
          </View>
        </View>

        {/* Header Text */}
        <Text className="text-4xl font-bold text-slate-900">
          Welcome to KampusLF
        </Text>
        <Text className="mt-3 text-base leading-6 text-optional">
          Your campus companion for quick help, local discovery, and staying
          connected with everything happening around you.
        </Text>

        {/* Feature Cards */}
        <View className="mt-8 gap-3">
          <View className="flex-row items-center rounded-2xl border border-brand bg-secondary p-4">
            <View className="mr-4 rounded-xl bg-brand/10 p-2.5">
              <MaterialCommunityIcons
                name="magnify-scan"
                size={24}
                className="text-brand"
              />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-slate-900">
                Find lost items faster
              </Text>
              <Text className="mt-0.5 text-sm text-optional">
                Report, search, and recover what matters most.
              </Text>
            </View>
          </View>

          <View className="flex-row items-center rounded-2xl border border-brand bg-secondary p-4">
            <View className="mr-4 rounded-xl bg-brand/10 p-2.5">
              <MaterialCommunityIcons
                name="map-marker-radius"
                size={24}
                className="text-brand"
              />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-slate-900">
                Discover campus essentials
              </Text>
              <Text className="mt-0.5 text-sm text-optional">
                Access services, updates, and useful resources.
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Simplified Next Action */}
      <View className="gap-3">
        <Link href="/(tabs)" asChild>
          <Pressable className="flex-row items-center justify-center rounded-xl bg-brand px-4 py-4">
            <Text className="text-base font-semibold text-black">
              Next
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
};

export default OnboardingScreen;