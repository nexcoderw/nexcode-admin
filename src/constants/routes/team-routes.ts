export const TEAM_ROUTES = {
  list: "/team",
} as const;

export const TEAM_API_ROUTES = {
  list: "/api/team/list",

  add: "/api/team/add",

  update: (teamId: number) => `/api/team/update/${teamId}`,

  delete: (teamId: number) => `/api/team/delete/${teamId}`,

  media: "/api/team/media",
} as const;
