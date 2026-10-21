import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import InputField from "@/components/input-field/InputField";
import GoBack from "@/components/go-back/GoBack";
import { useAuth } from "@/hooks/auth/useAuth";
import Toast from "react-native-toast-message";
import Loading from "@/components/loading/Loading";

const signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, isLoading, user } = useAuth();
  const { continueToCreate, continueToProfile } = useLocalSearchParams<{
    continueToCreate?: string;
    continueToProfile?: string;
  }>();

  const handleSignIn = async () => {
    if (!email.trim() && !password) {
      Toast.show({
        type: "error",
        text1: "Missing information",
        text2: "Please complete all fields.",
      });
      return;
    }
    try {
      await signIn(email, password);
      Toast.show({
        type: "success",
        text1: `Welcome Back ${user?.name}`,
        text2: "Explore KampusL&F!",
      });
      router.replace(
        continueToCreate === "1"
          ? "/(tabs)/add"
          : continueToCreate === "2"
            ? "/(request)/createRequest"
            : continueToProfile === "1"
              ? "/(profile)/profile"
              : "/(tabs)",
      );
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Sign in failed",
        text2: error instanceof Error ? error.message : "Please try again.",
      });
    }
  };

  return (
    <View className="flex-1 bg-secondary px-5 pt-16">
      <GoBack fallbackHref="/" />
      <View className="flex-1 items-center justify-center">
        <View className="mb-8 gap-4">
          <Text className="text-4xl text-brand font-extrabold">
            Welcome to KampusL&F
          </Text>
          <Text className="text-3xl font-bold text-slate-900 text-center">
            Sign in to continue
          </Text>
        </View>

        <View className="bg-secondary p-5 w-full">
          <View className="gap-4">
            <InputField
              label="Email address"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              className="w-full"
            />

            <InputField
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              className="w-full"
            />
          </View>

          <Pressable
            onPress={handleSignIn}
            disabled={isLoading}
            className="mt-6 items-center justify-center rounded-xl bg-brand px-4 py-3"
          >
            {isLoading ? (
              <Loading />
            ) : (
              <Text className="text-base font-semibold text-black">
                Sign In
              </Text>
            )}
          </Pressable>

          <View className="mt-5 flex-row items-center justify-center gap-1">
            <Text className="text-sm text-optional">
              Already have an account?
            </Text>
            <Link href="/signup" asChild>
              <Pressable>
                <Text className="text-sm font-semibold text-brand">
                  Sign Up
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
};

export default signin;
