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
  portfolio: {
    list:
      "/api/portfolio/list",

    add:
      "/api/portfolio/add",

    detail: (
      portfolioId: number,
    ) =>
      `/api/portfolio/detail/${portfolioId}`,

    update: (
      portfolioId: number,
    ) =>
      `/api/portfolio/update/${portfolioId}`,

    delete: (
      portfolioId: number,
    ) =>
      `/api/portfolio/delete/${portfolioId}`,

    imageAdd: (
      portfolioId: number,
    ) =>
      `/api/portfolio/image/add/${portfolioId}`,

    imageUpdate: (
      imageId: number,
    ) =>
      `/api/portfolio/image/update/${imageId}`,

    imageDelete: (
      imageId: number,
    ) =>
      `/api/portfolio/image/delete/${imageId}`,

    documentAdd: (
      portfolioId: number,
    ) =>
      `/api/portfolio/document/add/${portfolioId}`,

    documentUpdate: (
      documentId: number,
    ) =>
      `/api/portfolio/document/update/${documentId}`,

    documentDelete: (
      documentId: number,
    ) =>
      `/api/portfolio/document/delete/${documentId}`,

    repositoryAdd: (
      portfolioId: number,
    ) =>
      `/api/portfolio/repository/add/${portfolioId}`,

    repositoryUpdate: (
      repositoryId: number,
    ) =>
      `/api/portfolio/repository/update/${repositoryId}`,

    repositoryDelete: (
      repositoryId: number,
    ) =>
      `/api/portfolio/repository/delete/${repositoryId}`,

    media:
      "/api/portfolio/media",
  },
} as const;
