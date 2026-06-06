import { JWTPayload } from "jose";

interface LoggedInUserSessionInterface {
  userId: string | null;
  isAuth: true;
  subscription?: "free" | "pro" | "premium";
}

interface NonLoggedInUserSessionInterface {
  userId: null;
  isAuth: false;
}

export type UserSessionInterface = 
  LoggedInUserSessionInterface
  | NonLoggedInUserSessionInterface;

export interface Theme {
  theme: "dark" | "light";
}

export interface UserSessionPayload extends JWTPayload {
  userId: string;
  subscription?: "free" | "pro" | "premium";
}

export interface UserThemePayload extends JWTPayload {
  theme: Theme["theme"];
}
