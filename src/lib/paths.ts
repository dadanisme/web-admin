export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  FORBIDDEN: "/forbidden",
  REGISTER: "/register",
  INVITE: "/invite",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
