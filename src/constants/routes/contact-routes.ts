/*
 * Contacts live on a single page: reading and replying happen in a
 * dialog over the table, so there are no per-message page routes.
 */
export const CONTACT_ROUTES = {
  list: "/contacts",
} as const;

export const CONTACT_API_ROUTES = {
  reply: (
    contactId: number,
  ) =>
    `/api/contact/reply/${contactId}`,
} as const;
