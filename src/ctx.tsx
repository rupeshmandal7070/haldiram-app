import { useContext, createContext, type PropsWithChildren } from "react";
import { useStorageState } from "./useStorageState";
import { logout } from "./httpService";

const AuthContext = createContext<{
  signIn: (a: object) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session_key");
  return (
    <AuthContext.Provider
      value={{
        signIn: (data: object) => {
          setSession(JSON.stringify(data));
        },
        signOut: () => {
          setSession(null);
          logout();
        },
        session: session ? JSON.parse(session) : null,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
