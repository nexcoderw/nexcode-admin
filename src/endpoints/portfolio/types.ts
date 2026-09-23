import "server-only";

import type {
    PortfolioDetail,
    PortfolioDocument,
    PortfolioImage,
    PortfolioListData,
    PortfolioRepository,
} from "@/types/portfolio/portfolio";

export interface PortfolioListResult {
    ok: boolean;
    status: number;
    data: PortfolioListData | null;
}

export interface PortfolioDetailResult {
    ok: boolean;
    status: number;
    portfolio: PortfolioDetail | null;
}

export interface PortfolioMutationResult<T> {
    ok: boolean;
    status: number;
    data: T | null;
    fields: string[];
}

export type PortfolioWriteResult =
    PortfolioMutationResult<PortfolioDetail>;

export type PortfolioImageResult =
    PortfolioMutationResult<PortfolioImage>;

export type PortfolioDocumentResult =
    PortfolioMutationResult<PortfolioDocument>;

export type PortfolioRepositoryResult =
    PortfolioMutationResult<PortfolioRepository>;

export interface PortfolioDeleteResult {
    ok: boolean;
    status: number;
}

export interface PortfolioMutationCsrf {
    cookie: string;
    token: string;
}