import {
  createContext,
  useContext,
  FC,
  useCallback,
  useState,
  useEffect,
} from "react";
import type { User } from "pocketbase";
import { useInterval } from "usehooks-ts";
import jwtDecode from "jwt-decode";
import ms from "ms";

import { pocketbase } from "../utils/pocketbase";

interface Props {
  children?: React.ReactNode;
}

interface ISignIn {
  token: string;
  user: User;
}

interface IToken {
  exp: number;
  id: string;
  type: string;
}

export interface ICreateAccount {
  email: string;
  password: string;
  passwordConfirm: string;
}

interface IAuthContext {
  createAccount: (data: ICreateAccount) => Promise<User>;
  login: (email: string, password: string) => Promise<ISignIn>;
  logout: () => void;
  user?: User;
  token?: string;
}

const AuthContext = createContext<IAuthContext | null>(null);

const fiveMinutesInMs = ms("5 minutes");
const twoMinutesInMs = ms("2 minutes");

export const AuthProvider: FC<Props> = ({ children }) => {
  const [token, setToken] = useState<string>();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    // @ts-ignore
    return pocketbase.authStore.onChange((token: string, model: User) => {
      setToken(token);
      setUser(model);
    });
  }, []);

  const createAccount = useCallback(async (data: ICreateAccount) => {
    return await pocketbase.users.create(data);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    return await pocketbase.users.authViaEmail(email, password);
  }, []);

  const logout = useCallback(() => {
    pocketbase.authStore.clear();
    return;
  }, []);

  const refreshSession = useCallback(async () => {
    if (!token) return;
    const decoded = jwtDecode<IToken>(token);
    const tokenExpiration = decoded.exp;
    const expirationWithBuffer = (decoded.exp + fiveMinutesInMs) / 1000;
    if (tokenExpiration < expirationWithBuffer) {
      await pocketbase.users.refresh();
    }
    return;
  }, [token]);

  useInterval(refreshSession, token ? twoMinutesInMs : null);

  return (
    <AuthContext.Provider value={{ createAccount, login, logout, user, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
