import { getUserByAccessToken, getUserById } from "../services/utils";
import React, { createContext, useContext, useState, useEffect } from "react";

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
        // console.log("AuthContext - loaded userId:", id);
        if (id) {
          setUserId(id);
        }

        const user = await getUserByAccessToken();
        if (user) {
          // console.log("AuthContext - loaded accommodationId:", user.accommodationId);
          const accId = user.accommodationId;
          if (accId) {
            setAccommodationId(accId);
          }
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
