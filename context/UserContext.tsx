"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role?: string;
  phone?: string | null;
  address?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface FetchUserResponse {
  success: boolean;
  message?: string;
}

interface UpdateUserResponse {
  success: boolean;
  message?: string;
  user?: User;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  fetchUser: (id: string) => Promise<FetchUserResponse>;
  updateUser: (
    id: string,
    data: { name?: string; image?: string; phone?: string; address?: string }
  ) => Promise<UpdateUserResponse>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Memoized fetchUser to prevent infinite loops
  const fetchUser = useCallback(async (id: string): Promise<FetchUserResponse> => {
    try {
      setLoading(true);
      const res = await fetch(`/api/users/${id}`);
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        return { success: true };
      } else {
        return { success: false, message: data.message || "Failed to fetch user" };
      }
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : String(error) };
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Memoized updateUser to keep reference stable
  const updateUser = useCallback(
    async (
      id: string,
      updateData: { name?: string; image?: string; phone?: string; address?: string }
    ): Promise<UpdateUserResponse> => {
      try {
        setLoading(true);
        const res = await fetch(`/api/users/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        });
        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
          return { success: true, message: data.message || "User updated", user: data.user };
        } else {
          return { success: false, message: data.message || "Failed to update user" };
        }
      } catch (error) {
        return { success: false, message: error instanceof Error ? error.message : String(error) };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return (
    <UserContext.Provider value={{ user, loading, fetchUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

// ✅ Hook for consuming the context
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used inside UserProvider");
  }
  return context;
}
