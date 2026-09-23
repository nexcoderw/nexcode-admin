/**
 * Admin sections that do not yet have a feature of their own. When one
 * is built, its routes move out to a dedicated `<feature>-routes.ts`
 * alongside its API routes, as portfolio, team and client already have.
 */
export const ADMIN_ROUTES = {
  dashboard: "/",

  blogs: "/blogs",
  trainings: "/trainings",
  testimonials: "/testimonials",

  contacts: "/contacts",

  payments: "/payments",
  paymentStatuses: "/payments/statuses",

  settings: "/settings",
} as const;
