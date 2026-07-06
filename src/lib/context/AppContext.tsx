import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Lang, Role, User, Weights } from "../types";
import { dict, type TKey } from "../i18n/dict";
import { DEFAULT_WEIGHTS } from "../algorithms/fitscore";

interface AppState {
  user: User | null;
  lang: Lang;
  role: Role;
  online: boolean;
  weights: Weights;
  simulateOffline: boolean;
}

interface AppContextValue extends AppState {
  t: (key: TKey) => string;
  setLang: (l: Lang) => void;
  setRole: (r: Role) => void;
  toggleRole: () => void;
  signIn: (email: string) => void;
  signUp: (name: string, email: string) => void;
  signOut: () => void;
  updateUser: (patch: Partial<User>) => void;
  setWeights: (w: Weights) => void;
  setSimulateOffline: (v: boolean) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEY = "binder_state_v1";

function loadPersisted(): Partial<AppState> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function persist(state: AppState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        user: state.user,
        lang: state.lang,
        role: state.role,
        weights: state.weights,
        simulateOffline: state.simulateOffline,
      }),
    );
  } catch {
    /* ignore */
  }
}

function defaultWeights(userId: string): Weights {
  return { userId, updatedAt: new Date().toISOString(), ...DEFAULT_WEIGHTS };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const p = loadPersisted();
    return {
      user: p.user ?? null,
      lang: p.lang ?? "en",
      role: p.role ?? "client",
      online: true,
      weights: p.weights ?? defaultWeights("guest"),
      simulateOffline: p.simulateOffline ?? false,
    };
  });

  // Network detection
  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => setState((s) => ({ ...s, online: navigator.onLine }));
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  useEffect(() => {
    persist(state);
  }, [state]);

  const setLang = useCallback(
    (lang: Lang) => setState((s) => ({ ...s, lang })),
    [],
  );
  const setRole = useCallback(
    (role: Role) =>
      setState((s) => ({
        ...s,
        role,
        user: s.user ? { ...s.user, activeRole: role } : s.user,
      })),
    [],
  );
  const toggleRole = useCallback(
    () =>
      setState((s) => {
        const role: Role = s.role === "client" ? "provider" : "client";
        return {
          ...s,
          role,
          user: s.user ? { ...s.user, activeRole: role } : s.user,
        };
      }),
    [],
  );

  const signIn = useCallback((email: string) => {
    setState((s) => {
      const user: User =
        s.user && s.user.email === email
          ? s.user
          : {
              id: "u_" + Math.random().toString(36).slice(2, 9),
              email,
              name: email.split("@")[0] || "Guest",
              activeRole: "client",
              objective: "find_service",
              preferences: [],
              location: "Douala",
              language: s.lang,
              profileCompletion: 30,
              createdAt: new Date().toISOString(),
            };
      return {
        ...s,
        user,
        role: user.activeRole,
        weights:
          s.weights.userId === user.id ? s.weights : defaultWeights(user.id),
      };
    });
  }, []);

  const signUp = useCallback((name: string, email: string) => {
    setState((s) => {
      const user: User = {
        id: "u_" + Math.random().toString(36).slice(2, 9),
        email,
        name,
        activeRole: "client",
        objective: "find_service",
        preferences: [],
        location: "Douala",
        language: s.lang,
        profileCompletion: 20,
        createdAt: new Date().toISOString(),
      };
      return {
        ...s,
        user,
        role: user.activeRole,
        weights: defaultWeights(user.id),
      };
    });
  }, []);

  const signOut = useCallback(() => {
    setState((s) => ({ ...s, user: null }));
  }, []);

  const updateUser = useCallback((patch: Partial<User>) => {
    setState((s) => (s.user ? { ...s, user: { ...s.user, ...patch } } : s));
  }, []);

  const setWeights = useCallback(
    (weights: Weights) => setState((s) => ({ ...s, weights })),
    [],
  );

  const setSimulateOffline = useCallback(
    (v: boolean) => setState((s) => ({ ...s, simulateOffline: v })),
    [],
  );

  const value = useMemo<AppContextValue>(() => {
    const effectiveOnline = state.online && !state.simulateOffline;
    return {
      ...state,
      online: effectiveOnline,
      t: (key) => dict[state.lang][key] ?? dict.en[key] ?? String(key),
      setLang,
      setRole,
      toggleRole,
      signIn,
      signUp,
      signOut,
      updateUser,
      setWeights,
      setSimulateOffline,
    };
  }, [
    state,
    setLang,
    setRole,
    toggleRole,
    signIn,
    signUp,
    signOut,
    updateUser,
    setWeights,
    setSimulateOffline,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
