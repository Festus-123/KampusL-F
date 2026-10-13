import { Link } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";

import InputField from "@/components/input-field/InputField";

const signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View className="flex-1 bg-secondary px-5 pt-16">
      <View className="mb-8">
        <Text className="text-3xl font-bold text-slate-900">Create account</Text>
        <Text className="mt-2 text-base text-optional">Sign up to continue</Text>
      </View>

      <View className="rounded-3xl border border-brand bg-secondary p-5 shadow-sm">
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

        <Pressable className="mt-6 items-center justify-center rounded-xl bg-brand px-4 py-3.5">
          <Text className="text-base font-semibold text-secondary">Sign Up</Text>
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
