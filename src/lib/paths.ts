export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  FORBIDDEN: "/forbidden",
  REGISTER: "/register",
  INVITE: "/invite",
} as const;

// Dynamic route helpers
export const createRegisterPath = (registrationId: string) =>
  `/register/${registrationId}`;
export const createInvitePath = () => "/invite";

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
