import { useRouter } from "expo-router";
import { createContext, PropsWithChildren, useState } from "react";

type AuthType = {
  isLoggedIn: boolean;
  logIn: () => void;
  logOut: () => void;
};

export const AuthContext = createContext<AuthType>({
  isLoggedIn: false,
  logIn: () => {},
  logOut: () => {},
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const logIn = () => {
    setIsLoggedIn(true);
    router.replace("/");
  };
  const logOut = () => {
    setIsLoggedIn(false);
    router.replace("/");
  };
  return (
    <AuthContext.Provider value={{ isLoggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}
