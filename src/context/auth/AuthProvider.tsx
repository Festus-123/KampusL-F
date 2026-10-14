import { useState, type ReactNode } from "react";
import { AuthContext, type AuthUser } from "./authContext";

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  error?: string;
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function authenticate(
    endpoint: "signup" | "signin",
    credentials: Record<string, string>,
  ) {
    if (!API_BASE_URL) {
      throw new Error("EXPO_PUBLIC_API_URL is not configured.");
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL.replace(/\/$/, "")}/api/v1/auth/${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        },
      );

      const payload = (await response
        .json()
        .catch(() => ({}))) as Partial<AuthResponse>;

      if (!response.ok) {
        throw new Error(payload.error ?? "Authentication request failed.");
      }

      if (!payload.accessToken || !payload.refreshToken || !payload.user) {
        throw new Error(
          "The server returned an invalid authentication response.",
        );
      }

      setUser(payload.user);
      setAccessToken(payload.accessToken);
      setRefreshToken(payload.refreshToken);
    } finally {
      setIsLoading(false);
    }
  }

  function signUp(name: string, email: string, password: string) {
    return authenticate("signup", { name, email, password });
  }

  function signIn(email: string, password: string) {
    return authenticate("signin", { email, password });
  }

  function signOut() {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        isLoading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
