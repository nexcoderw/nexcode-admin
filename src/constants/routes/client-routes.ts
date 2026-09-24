/*
 * Clients live on a single page: viewing, adding and editing happen in
 * dialogs over the list, so there are no per-client page routes.
 */
export const CLIENT_ROUTES = {
  list: "/clients",
} as const;

export const CLIENT_API_ROUTES = {
  list:
    "/api/client/list",

  add:
    "/api/client/add",

  detail: (
    clientId: number,
  ) =>
    `/api/client/detail/${clientId}`,

  update: (
    clientId: number,
  ) =>
    `/api/client/update/${clientId}`,

  delete: (
    clientId: number,
  ) =>
    `/api/client/delete/${clientId}`,
} as const;
