import Cookies from "js-cookie";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "../services/api";

type User = {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
};

interface AuthContextData {
  user: User | null;
  signInUrl: string;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

type AuthResponse = {
  token: string;
  user: User;
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const signInUrl = `https://github.com/login/oauth/authorize?scode=user&client_id=aafcaffec9a7ba95a521`;

  async function signIn(githubCode: string) {
    try {
      const response = await api.post<AuthResponse>("authenticate", {
        code: githubCode,
      });

      const { token, user } = response.data;

      Cookies.set("@dowhile:token", token);

      setUser(user);
    } catch (err) {}
  }

  function signOut() {
    setUser(null);
    Cookies.remove('@dowhile:token')
  }

  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes("?code=");

    if (hasGithubCode) {
      const [urlWithoutCode, githubCode] = url.split("?code=");

      window.history.pushState({}, "", urlWithoutCode);

      signIn(githubCode);
    }
  }, []);

  useEffect(() => {
    const token = Cookies.get("@dowhile:token");

    if (token) {
      api.get<User>("profile").then((response) => {
        setUser(response.data)
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, signInUrl, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
