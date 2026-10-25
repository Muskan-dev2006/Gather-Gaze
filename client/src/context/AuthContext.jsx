import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getCurrentUser, signInWithGoogle, signOut } from "../api/auth.api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [signInMessage, setSignInMessage] = useState("");
  const pendingAction = useRef(null);

  useEffect(() => {
    getCurrentUser().then(setUser).catch(() => setUser(null)).finally(() => setLoading(false));
  }, []);

  const requireAuth = useCallback((action, message) => {
    if (user) {
      action?.();
      return;
    }
    pendingAction.current = action || null;
    setSignInMessage(message || "Sign in to continue.");
    setIsSignInOpen(true);
  }, [user]);

  const closeSignIn = useCallback(() => {
    pendingAction.current = null;
    setIsSignInOpen(false);
  }, []);

  const completeSignIn = useCallback(async (credential) => {
    const signedInUser = await signInWithGoogle(credential);
    setUser(signedInUser);
    setIsSignInOpen(false);
    const action = pendingAction.current;
    pendingAction.current = null;
    action?.();
    return signedInUser;
  }, []);

  const logout = useCallback(async () => {
    await signOut();
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    requireAuth,
    isSignInOpen,
    signInMessage,
    closeSignIn,
    completeSignIn,
    logout,
  }), [user, loading, requireAuth, isSignInOpen, signInMessage, closeSignIn, completeSignIn, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
