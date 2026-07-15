import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Lang, Role, User, Weights } from "../types";
import { dict, type TKey } from "../i18n/dict";
import { DEFAULT_WEIGHTS } from "../algorithms/fitscore";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import type { Session } from "@supabase/supabase-js";

interface AppState {
  user: User | null;
  lang: Lang;
  role: Role;
  online: boolean;
  weights: Weights;
  simulateOffline: boolean;
  loading: boolean;
}

interface AppContextValue extends AppState {
  t: (key: TKey) => string;
  setLang: (l: Lang) => void;
  setRole: (r: Role) => void;
  toggleRole: () => void;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ error?: string }>;
  signInGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateUser: (patch: Partial<User>) => Promise<void>;
  setWeights: (w: Weights) => void;
  setSimulateOffline: (v: boolean) => void;
}

const AppContext = createContext<AppContextValue | null>(null);
const STORAGE_KEY = "binder_prefs_v1";

function loadPrefs(): { lang?: Lang; simulateOffline?: boolean } {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function defaultWeights(userId: string): Weights {
  return { userId, updatedAt: new Date().toISOString(), ...DEFAULT_WEIGHTS };
}

type ProfileRow = {
  id: string;
  email: string;
  name: string;
  active_role: Role;
  objective: User["objective"];
  preferences: string[] | null;
  location: string;
  language: Lang;
  profile_completion: number;
  created_at: string;
};

function profileToUser(p: ProfileRow): User {
  return {
    id: p.id,
    email: p.email,
    name: p.name,
    activeRole: p.active_role,
    objective: p.objective,
    preferences: p.preferences ?? [],
    location: p.location,
    language: p.language,
    profileCompletion: p.profile_completion,
    createdAt: p.created_at,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const prefs = typeof window !== "undefined" ? loadPrefs() : {};
  const [state, setState] = useState<AppState>({
    user: null,
    lang: prefs.lang ?? "en",
    role: "client",
    online: true,
    weights: defaultWeights("guest"),
    simulateOffline: prefs.simulateOffline ?? false,
    loading: true,
  });
  const sessionRef = useRef<Session | null>(null);

  // Persist minimal prefs
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          lang: state.lang,
          simulateOffline: state.simulateOffline,
        }),
      );
    } catch {
      /* ignore */
    }
  }, [state.lang, state.simulateOffline]);

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

  // Load profile from Supabase given a session
  const loadProfile = useCallback(async (session: Session | null) => {
    if (!session) {
      setState((s) => ({ ...s, user: null, loading: false }));
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select(
        "id,email,name,active_role,objective,preferences,location,language,profile_completion,created_at",
      )
      .eq("id", session.user.id)
      .maybeSingle();
    if (data) {
      const u = profileToUser(data as ProfileRow);
      setState((s) => ({
        ...s,
        user: u,
        role: u.activeRole,
        weights:
          s.weights.userId === u.id ? s.weights : defaultWeights(u.id),
        loading: false,
      }));
    } else {
      // Trigger should have created it; fall back to minimal user
      const u: User = {
        id: session.user.id,
        email: session.user.email ?? "",
        name: session.user.email?.split("@")[0] ?? "You",
        activeRole: "client",
        objective: "find_service",
        preferences: [],
        location: "Douala",
        language: state.lang,
        profileCompletion: 20,
        createdAt: new Date().toISOString(),
      };
      setState((s) => ({ ...s, user: u, loading: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auth bootstrap
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      sessionRef.current = session;
      if (event === "SIGNED_OUT") {
        setState((s) => ({ ...s, user: null, loading: false }));
        return;
      }
      if (
        event === "SIGNED_IN" ||
        event === "INITIAL_SESSION" ||
        event === "TOKEN_REFRESHED" ||
        event === "USER_UPDATED"
      ) {
        void loadProfile(session);
      }
    });
    void supabase.auth.getSession().then(({ data }) => {
      sessionRef.current = data.session;
      void loadProfile(data.session);
    });
    return () => sub.subscription.unsubscribe();
  }, [loadProfile]);

  const setLang = useCallback(
    (lang: Lang) => setState((s) => ({ ...s, lang })),
    [],
  );
  const setRole = useCallback((role: Role) => {
    setState((s) => ({
      ...s,
      role,
      user: s.user ? { ...s.user, activeRole: role } : s.user,
    }));
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user)
        void supabase.from("profiles").update({ active_role: role }).eq("id", data.user.id);
    });
  }, []);
  const toggleRole = useCallback(() => {
    setState((s) => {
      const role: Role = s.role === "client" ? "provider" : "client";
      void supabase.auth.getUser().then(({ data }) => {
        if (data.user)
          void supabase.from("profiles").update({ active_role: role }).eq("id", data.user.id);
      });
      return {
        ...s,
        role,
        user: s.user ? { ...s.user, activeRole: role } : s.user,
      };
    });
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
  }, []);

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      const redirectTo =
        typeof window !== "undefined" ? window.location.origin : undefined;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: redirectTo,
        },
      });
      if (error) return { error: error.message };
      return {};
    },
    [],
  );

  const signInGoogle = useCallback(async () => {
    const redirect_uri =
      typeof window !== "undefined" ? window.location.origin : "";
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri });
    if (result.error) return { error: String(result.error.message ?? result.error) };
    return {};
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setState((s) => ({ ...s, user: null }));
  }, []);

  const updateUser = useCallback(async (patch: Partial<User>) => {
    setState((s) => (s.user ? { ...s, user: { ...s.user, ...patch } } : s));
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) return;
    const dbPatch: Record<string, unknown> = {};
    if (patch.name !== undefined) dbPatch.name = patch.name;
    if (patch.activeRole !== undefined) dbPatch.active_role = patch.activeRole;
    if (patch.objective !== undefined) dbPatch.objective = patch.objective;
    if (patch.preferences !== undefined) dbPatch.preferences = patch.preferences;
    if (patch.location !== undefined) dbPatch.location = patch.location;
    if (patch.language !== undefined) dbPatch.language = patch.language;
    if (patch.profileCompletion !== undefined)
      dbPatch.profile_completion = patch.profileCompletion;
    if (Object.keys(dbPatch).length === 0) return;
    await supabase.from("profiles").update(dbPatch).eq("id", authData.user.id);
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
      signInGoogle,
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
    signInGoogle,
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
