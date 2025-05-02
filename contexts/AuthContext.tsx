import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { getUserById } from "../services/utils";

interface AuthContextType {
  userId: string | null;
  setUserId: (id: string | null) => void;
  accommodationId: string | null;
  setAccommodationId: (id: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [accommodationId, setAccommodationId] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const id = await getUserById();
        if (id) {
          setUserId(id);
        }

        const accId = await SecureStore.getItemAsync("accommodationId");
        if (accId) {
          setAccommodationId(accId);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{ userId, setUserId, accommodationId, setAccommodationId }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
