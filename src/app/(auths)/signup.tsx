import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Toast from "react-native-toast-message";

import InputField from "@/components/input-field/InputField";
import { useAuth } from "@/hooks/auth/useAuth";

const signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {signUp, isLoading} = useAuth();

  const handleSignUp = async () => {
    if (!fullName.trim() || !email.trim() || !password) {
      Toast.show({
        type: "error",
        text1: "Missing information",
        text2: "Please complete all fields.",
      });
      return;
    }

    try {
      await signUp(fullName, email, password);
      Toast.show({
        type: "success",
        text1: "Account created",
        text2: "Welcome to KampusL&F!",
      });
      router.replace("/(tabs)");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Sign up failed",
        text2: error instanceof Error ? error.message : "Please try again.",
      });
    }
  }

  return (
    <View className="flex-1 bg-secondary px-5 pt-16 items-center justify-center">
      <View className="mb-8 gap-4">
        <Text className="text-4xl text-brand font-extrabold">Welcome to KampusL&F</Text>
        <Text className="text-3xl font-bold text-slate-900 text-center">Create account</Text>
      </View>

      <View className="bg-secondary p-5 w-full">
        <View className="gap-4">
          <InputField
            label="Full name"
            placeholder="Jane Doe"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            className="w-full"
          />

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
          onPress={handleSignUp}
          disabled={isLoading}
          className="mt-6 items-center justify-center rounded-xl bg-brand px-4 py-3.5">
            <Text className="text-base font-semibold text-black">Sign Up</Text>
        </Pressable>

        <View className="mt-5 flex-row items-center justify-center gap-1">
          <Text className="text-sm text-optional">Already have an account?</Text>
          <Link href="/signin" asChild>
            <Pressable>
              <Text className="text-sm font-semibold text-brand">Sign in</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
};

export default signup;
