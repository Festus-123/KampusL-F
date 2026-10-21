import { useCallback, useEffect, useState, type ReactNode } from "react";
import { AppState } from "react-native";
import { AuthContext, type AuthUser } from "./authContext";

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  error?: string;
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

function getTokenExpirationTime(token: string): number | null {
  try {
    const encodedPayload = token.split(".")[1];
    if (!encodedPayload) return null;

    const base64Payload = encodedPayload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(encodedPayload.length / 4) * 4, "=");
    const binaryPayload = globalThis.atob(base64Payload);
    const jsonPayload = decodeURIComponent(
      Array.from(
        binaryPayload,
        (character) =>
          `%${character.charCodeAt(0).toString(16).padStart(2, "0")}`,
      ).join(""),
    );
    const payload = JSON.parse(jsonPayload) as { exp?: unknown };

    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

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

  const signOut = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    const expiresAt = getTokenExpirationTime(accessToken);
    if (expiresAt === null) {
      signOut();
      return;
    }

    let timeout: ReturnType<typeof setTimeout> | undefined;
    const checkExpiration = () => {
      if (timeout) clearTimeout(timeout);

      const remainingTime = expiresAt - Date.now();
      if (remainingTime <= 0) {
        signOut();
        return;
      }

      timeout = setTimeout(checkExpiration, remainingTime);
    };

    checkExpiration();
    const appStateSubscription = AppState.addEventListener(
      "change",
      (state) => {
        if (state === "active") checkExpiration();
      },
    );

    return () => {
      if (timeout) clearTimeout(timeout);
      appStateSubscription.remove();
    };
  }, [accessToken, signOut]);

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
