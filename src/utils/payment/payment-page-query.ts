import {
  PAYMENT_AGREEMENT_ORDERINGS,
  PAYMENT_AGREEMENT_STATUSES,
  PAYMENT_AGREEMENT_TYPES,
  PAYMENT_CURRENCIES,
} from "@/constants/payment/payment-query";
import {
  PAYMENT_ROUTES,
} from "@/constants/routes/payment-routes";
import type {
  PaymentAgreementListQuery,
  PaymentAgreementOrdering,
  PaymentAgreementStatus,
  PaymentAgreementType,
} from "@/types/payment/agreement";
import type {
  PaymentCurrency,
} from "@/types/payment/shared";

export interface ResolvedPaymentAgreementQuery {
  search: string;

  ordering:
    PaymentAgreementOrdering;

  portfolioId?: number;

  agreementType?:
    PaymentAgreementType;

  status?:
    PaymentAgreementStatus;

  currency?:
    PaymentCurrency;

  page: number;
  pageSize: number;
}

type PageParams =
  Record<
    string,
    string |
    string[] |
    undefined
  >;

export function resolvePaymentAgreementQuery(
  params: PageParams,
): ResolvedPaymentAgreementQuery {
  return {
    search:
      stringValue(
        params.search,
      ),

    ordering:
      choice(
        params.ordering,
        PAYMENT_AGREEMENT_ORDERINGS,
      ) ?? "-created_at",

    portfolioId:
      positiveInteger(
        params.portfolioId,
      ),

    agreementType:
      choice(
        params.agreementType,
        PAYMENT_AGREEMENT_TYPES,
      ),

    status:
      choice(
        params.status,
        PAYMENT_AGREEMENT_STATUSES,
      ),

    currency:
      choice(
        params.currency,
        PAYMENT_CURRENCIES,
      ),

    page:
      positiveInteger(
        params.page,
      ) ?? 1,

    pageSize:
      Math.min(
        positiveInteger(
          params.pageSize,
        ) ?? 12,
        100,
      ),
  };
}

export function toPaymentAgreementEndpointQuery(
  query:
    ResolvedPaymentAgreementQuery,
): PaymentAgreementListQuery {
  return {
    search:
      query.search ||
      undefined,

    ordering:
      query.ordering,

    portfolioId:
      query.portfolioId,

    agreementType:
      query.agreementType,

    status:
      query.status,

    currency:
      query.currency,

    page:
      query.page,

    pageSize:
      query.pageSize,
  };
}

export function buildPaymentListHref(
  query:
    ResolvedPaymentAgreementQuery,
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
    "-created_at"
  ) {
    params.set(
      "ordering",
      query.ordering,
    );
  }

  if (query.portfolioId) {
    params.set(
      "portfolioId",
      String(
        query.portfolioId,
      ),
    );
  }

  if (query.agreementType) {
    params.set(
      "agreementType",
      query.agreementType,
    );
  }

  if (query.status) {
    params.set(
      "status",
      query.status,
    );
  }

  if (query.currency) {
    params.set(
      "currency",
      query.currency,
    );
  }

  if (page > 1) {
    params.set(
      "page",
      String(page),
    );
  }

  const value =
    params.toString();

  return value
    ? `${PAYMENT_ROUTES.list}?${value}`
    : PAYMENT_ROUTES.list;
}

function stringValue(
  value:
    string |
    string[] |
    undefined,
) {
  return (
    typeof value === "string"
      ? value.trim()
      : ""
  );
}

function positiveInteger(
  value:
    string |
    string[] |
    undefined,
) {
  if (
    typeof value !== "string" ||
    !/^\d+$/.test(value)
  ) {
    return undefined;
  }

  const parsed =
    Number(value);

  return (
    Number.isSafeInteger(
      parsed,
    ) &&
    parsed > 0
  )
    ? parsed
    : undefined;
}

function choice<
  T extends string,
>(
  value:
    string |
    string[] |
    undefined,

  values:
    readonly T[],
): T | undefined {
  if (
    typeof value !== "string"
  ) {
    return undefined;
  }

  return values.includes(
    value as T,
  )
    ? value as T
    : undefined;
}