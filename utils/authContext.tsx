import AsyncStorage from "@react-native-async-storage/async-storage";
import { SplashScreen, useRouter } from "expo-router";
import { createContext, PropsWithChildren, useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

type AuthType = {
  isLoggedIn: boolean;
  isReady: boolean;
  logIn: () => void;
  logOut: () => void;
};

const authStorageKey = "auth-key";

export const AuthContext = createContext<AuthType>({
  isLoggedIn: false,
  isReady: false,
  logIn: () => {},
  logOut: () => {},
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const storeAuthState = async (newState: { isLoggedIn: boolean }) => {
    try {
      const jsonValue = JSON.stringify(newState);
      await AsyncStorage.setItem(authStorageKey, jsonValue);
    } catch (error) {
      console.error("Error saving", error);
    }
  };

  const logIn = () => {
    setIsLoggedIn(true);
    storeAuthState({ isLoggedIn: true });
    router.replace("/");
  };
  const logOut = () => {
    setIsLoggedIn(false);
    storeAuthState({ isLoggedIn: false });
    router.replace("/");
  };

  useEffect(() => {
    const getAuthFromStorage = async () => {
      // simulate an API Request
      await new Promise((res) => setTimeout(() => res(null), 1000));
      try {
        const value = await AsyncStorage.getItem(authStorageKey);
        if (value !== null) {
          const auth = JSON.parse(value);
          setIsLoggedIn(auth.isLoggedIn);
        }
      } catch (error) {
        console.log("Error fetching from storage", error);
      }
      setIsReady(true);
    };
    getAuthFromStorage();
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, isReady, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}
