import { ProfileBasics } from "./ProfileBasics";

export interface AuthCheckResponse {
  authenticated: boolean;
  user: ProfileBasics | null;
  isAdmin?: boolean;
}
