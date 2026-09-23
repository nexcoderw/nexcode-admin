export const ROUTES = {
  auth: {
    login: "/login",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
    verify: "/verify",
  },

  admin: {
    dashboard: "/",

    portfolios: "/portfolios",
    clients: "/clients",

    team: "/team",

    blogs: "/blogs",
    trainings: "/trainings",
    testimonials: "/testimonials",

    contacts: "/contacts",

    payments: "/payments",
    paymentStatuses: "/payments/statuses",

    settings: "/settings",
  },

  errors: {
    serviceUnavailable: "/service-unavailable",
  },
} as const;

export const API_ROUTES = {
  auth: {
    login: "/api/auth/login",
    me: "/api/auth/me",
    logout: "/api/auth/logout",

    requestPasswordReset: "/api/auth/password-reset/request",

    verifyPasswordReset: "/api/auth/password-reset/verify",

    confirmPasswordReset: "/api/auth/password-reset/confirm",
  },
  team: {
    list: "/api/team/list",

    add: "/api/team/add",

    update: (teamId: number) => `/api/team/update/${teamId}`,

    delete: (teamId: number) => `/api/team/delete/${teamId}`,

    media: "/api/team/media",
  },
} as const;
