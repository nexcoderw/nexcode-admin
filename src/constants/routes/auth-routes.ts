export const AUTH_ROUTES = {
  login: "/login",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verify: "/verify",
} as const;

export const AUTH_API_ROUTES = {
  login: "/api/auth/login",
  me: "/api/auth/me",
  logout: "/api/auth/logout",

  requestPasswordReset: "/api/auth/password-reset/request",

  verifyPasswordReset: "/api/auth/password-reset/verify",

  confirmPasswordReset: "/api/auth/password-reset/confirm",
} as const;
