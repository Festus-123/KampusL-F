import { useAuth } from '@/hooks/auth/useAuth'
import { Stack } from 'expo-router'
import React from 'react'

const _layout = () => {
    const { user, accessToken } =  useAuth();
    const isAuthenticated = Boolean(user && accessToken);

  return (
    <Stack screenOptions={{ headerShown: false}}>
        <Stack.Protected guard={isAuthenticated}>
            <Stack.Screen name='profile'/>
        </Stack.Protected>
    </Stack>
  )
}

export default _layout
