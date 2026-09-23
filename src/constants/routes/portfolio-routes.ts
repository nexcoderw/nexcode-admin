export const PORTFOLIO_ROUTES = {
  list: "/portfolios",

  add: "/portfolios/add",

  detail: (
    portfolioId: number,
  ) =>
    `/portfolios/detail/${portfolioId}`,

  edit: (
    portfolioId: number,
  ) =>
    `/portfolios/edit/${portfolioId}`,
} as const;

export const PORTFOLIO_API_ROUTES = {
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
} as const;
