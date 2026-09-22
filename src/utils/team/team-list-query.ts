import { ROUTES } from "@/constants/routes";
import type {
  TeamListQuery,
  TeamOrdering,
} from "@/types/team/team";

const DEFAULT_ORDERING: TeamOrdering =
  "-created_at";

const DEFAULT_PAGE_SIZE = 20;

const ORDERINGS =
  new Set<TeamOrdering>([
    "name",
    "-name",
    "position",
    "-position",
    "created_at",
    "-created_at",
    "updated_at",
    "-updated_at",
  ]);

export interface ResolvedTeamListQuery {
  search: string;
  ordering: TeamOrdering;
  page: number;
  pageSize: number;
}

export function parseTeamListQuery(
  params: Record<
    string,
    string | string[] | undefined
  >,
): ResolvedTeamListQuery {
  const search =
    firstValue(
      params.search,
    )
      ?.trim()
      .slice(0, 100) ?? "";

  const orderingValue =
    firstValue(
      params.ordering,
    );

  const ordering =
    resolveOrdering(
      orderingValue,
    );

  const page =
    parsePositiveInteger(
      firstValue(
        params.page,
      ),
      1,
    );

  return {
    search,
    ordering,
    page,
    pageSize:
      DEFAULT_PAGE_SIZE,
  };
}

export function toTeamEndpointQuery(
  query: ResolvedTeamListQuery,
): TeamListQuery {
  return {
    search:
      query.search ||
      undefined,

    ordering:
      query.ordering,

    page:
      query.page,

    pageSize:
      query.pageSize,
  };
}

export function buildTeamListHref(
  query: ResolvedTeamListQuery,
  page: number,
) {
  const params =
    new URLSearchParams();

  if (query.search) {
    params.set(
      "search",
      query.search,
    );
  }

  if (
    query.ordering !==
    DEFAULT_ORDERING
  ) {
    params.set(
      "ordering",
      query.ordering,
    );
  }

  if (page > 1) {
    params.set(
      "page",
      String(page),
    );
  }

  const queryString =
    params.toString();

  return queryString
    ? `${ROUTES.admin.team}?${queryString}`
    : ROUTES.admin.team;
}

function resolveOrdering(
  value: string | undefined,
): TeamOrdering {
  if (!value) {
    return DEFAULT_ORDERING;
  }

  if (
    ORDERINGS.has(
      value as TeamOrdering,
    )
  ) {
    return value as TeamOrdering;
  }

  return DEFAULT_ORDERING;
}

function firstValue(
  value:
    | string
    | string[]
    | undefined,
): string | undefined {
  return Array.isArray(value)
    ? value[0]
    : value;
}

function parsePositiveInteger(
  value: string | undefined,
  fallback: number,
): number {
  if (
    !value ||
    !/^\d+$/.test(value)
  ) {
    return fallback;
  }

  const parsed =
    Number(value);

  if (
    !Number.isSafeInteger(
      parsed,
    ) ||
    parsed < 1
  ) {
    return fallback;
  }

  return parsed;
}