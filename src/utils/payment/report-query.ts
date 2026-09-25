import {
  PAYMENT_CURRENCIES,
} from "@/constants/payment/payment-query";
import {
  PAYMENT_API_ROUTES,
  PAYMENT_ROUTES,
} from "@/constants/routes/payment-routes";
import type {
  PaymentOutstandingKind,
  PaymentReportQuery,
} from "@/types/payment/report";
import type {
  PaymentCurrency,
} from "@/types/payment/shared";

export type PaymentReportTab =
  | "collections"
  | "outstanding";

export interface ResolvedPaymentReportQuery {
  portfolioId?: number;

  currency?: PaymentCurrency;

  dateFrom?: string;
  dateTo?: string;

  dueWithinDays: number;

  outstandingKind:
  PaymentOutstandingKind;

  tab:
  PaymentReportTab;
}

const OUTSTANDING_KINDS = [
  "all",
  "overdue",
  "due_soon",
] as const;

const PAYMENT_REPORT_TABS = [
  "collections",
  "outstanding",
] as const;

export function resolvePaymentReportQuery(
  params: Record<
    string,
    string | string[] | undefined
  >,
): ResolvedPaymentReportQuery {
  const dateFrom = dateValue(
    params.dateFrom,
  );

  const dateTo = dateValue(
    params.dateTo,
  );

  const datesAreValid =
    !dateFrom ||
    !dateTo ||
    dateFrom <= dateTo;

  return {
    portfolioId: positiveInteger(
      params.portfolioId,
    ),

    currency: choice(
      params.currency,
      PAYMENT_CURRENCIES,
    ),

    dateFrom: datesAreValid
      ? dateFrom
      : undefined,

    dateTo: datesAreValid
      ? dateTo
      : undefined,

    dueWithinDays: Math.min(
      positiveInteger(
        params.dueWithinDays,
      ) ?? 30,
      365,
    ),

    outstandingKind:
      choice(
        params.outstandingKind,
        OUTSTANDING_KINDS,
      ) ?? "all",

    tab:
      choice(
        params.tab,
        PAYMENT_REPORT_TABS,
      ) ?? "collections",
  };
}

export function parsePaymentReportSearchParams(
  params: URLSearchParams,
): ResolvedPaymentReportQuery | null {
  const portfolioId =
    params.get("portfolioId");

  const currency =
    params.get("currency");

  const dateFrom =
    params.get("dateFrom");

  const dateTo =
    params.get("dateTo");

  const dueWithinDays =
    params.get("dueWithinDays");

  const outstandingKind =
    params.get("outstandingKind");

  const tab =
    params.get("tab");

  if (
    portfolioId &&
    !positiveInteger(portfolioId)
  ) {
    return null;
  }

  if (
    currency &&
    !choice(
      currency,
      PAYMENT_CURRENCIES,
    )
  ) {
    return null;
  }

  if (
    dateFrom &&
    !dateValue(dateFrom)
  ) {
    return null;
  }

  if (
    dateTo &&
    !dateValue(dateTo)
  ) {
    return null;
  }

  if (
    dateFrom &&
    dateTo &&
    dateFrom > dateTo
  ) {
    return null;
  }

  if (dueWithinDays) {
    const parsed =
      positiveInteger(
        dueWithinDays,
      );

    if (
      !parsed ||
      parsed > 365
    ) {
      return null;
    }
  }

  if (
    outstandingKind &&
    !choice(
      outstandingKind,
      OUTSTANDING_KINDS,
    )
  ) {
    return null;
  }

  if (
    tab &&
    !choice(
      tab,
      PAYMENT_REPORT_TABS,
    )
  ) {
    return null;
  }

  return resolvePaymentReportQuery({
    portfolioId:
      portfolioId ??
      undefined,

    currency:
      currency ??
      undefined,

    dateFrom:
      dateFrom ??
      undefined,

    dateTo:
      dateTo ??
      undefined,

    dueWithinDays:
      dueWithinDays ??
      undefined,

    outstandingKind:
      outstandingKind ??
      undefined,

    tab:
      tab ??
      undefined,
  });
}

export function toPaymentReportEndpointQuery(
  query:
    ResolvedPaymentReportQuery,
): PaymentReportQuery {
  return {
    portfolioId:
      query.portfolioId,

    currency:
      query.currency,

    dateFrom:
      query.dateFrom,

    dateTo:
      query.dateTo,

    dueWithinDays:
      query.dueWithinDays,

    outstandingKind:
      query.outstandingKind,
  };
}

export function buildReportBackendSearch(
  query: PaymentReportQuery,
  options: {
    includeDates?: boolean;
    includeKind?: boolean;
  } = {},
) {
  const params =
    new URLSearchParams();

  setParam(
    params,
    "portfolio_id",
    query.portfolioId,
  );

  setParam(
    params,
    "currency",
    query.currency,
  );

  setParam(
    params,
    "due_within_days",
    query.dueWithinDays,
  );

  if (options.includeDates) {
    setParam(
      params,
      "date_from",
      query.dateFrom,
    );

    setParam(
      params,
      "date_to",
      query.dateTo,
    );
  }

  if (options.includeKind) {
    setParam(
      params,
      "kind",
      query.outstandingKind,
    );
  }

  const value =
    params.toString();

  return value
    ? `?${value}`
    : "";
}

export function buildPaymentReportsHref(
  query:
    ResolvedPaymentReportQuery,
) {
  const params =
    buildBrowserSearch(
      query,
    );

  const value =
    params.toString();

  return value
    ? `${PAYMENT_ROUTES.reports}?${value}`
    : PAYMENT_ROUTES.reports;
}

export function buildPaymentReportCsvHref(
  type:
    | "collections"
    | "outstanding",
  query:
    ResolvedPaymentReportQuery,
) {
  const params =
    buildBrowserSearch(
      query,
    );

  params.set(
    "type",
    type,
  );

  return (
    `${PAYMENT_API_ROUTES.reportCsv}?`
    + params.toString()
  );
}

function buildBrowserSearch(
  query:
    ResolvedPaymentReportQuery,
) {
  const params =
    new URLSearchParams();

  setParam(
    params,
    "portfolioId",
    query.portfolioId,
  );

  setParam(
    params,
    "currency",
    query.currency,
  );

  setParam(
    params,
    "dateFrom",
    query.dateFrom,
  );

  setParam(
    params,
    "dateTo",
    query.dateTo,
  );

  if (
    query.dueWithinDays !== 30
  ) {
    setParam(
      params,
      "dueWithinDays",
      query.dueWithinDays,
    );
  }

  if (
    query.outstandingKind !==
    "all"
  ) {
    setParam(
      params,
      "outstandingKind",
      query.outstandingKind,
    );
  }

  if (
    query.tab !==
    "collections"
  ) {
    setParam(
      params,
      "tab",
      query.tab,
    );
  }

  return params;
}

function setParam(
  params: URLSearchParams,
  key: string,
  value:
    string | number | undefined,
) {
  if (value !== undefined) {
    params.set(
      key,
      String(value),
    );
  }
}

function positiveInteger(
  value:
    string | string[] | undefined,
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

function dateValue(
  value:
    string | string[] | undefined,
) {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(
      value,
    )
  ) {
    return undefined;
  }

  const [
    year,
    month,
    day,
  ] = value
    .split("-")
    .map(Number);

  const parsed =
    new Date(
      Date.UTC(
        year,
        month - 1,
        day,
      ),
    );

  if (
    parsed.getUTCFullYear() !==
    year ||
    parsed.getUTCMonth() !==
    month - 1 ||
    parsed.getUTCDate() !==
    day
  ) {
    return undefined;
  }

  return value;
}

function choice<
  T extends string,
>(
  value:
    string | string[] | undefined,
  choices:
    readonly T[],
): T | undefined {
  if (
    typeof value !== "string"
  ) {
    return undefined;
  }

  return choices.includes(
    value as T,
  )
    ? value as T
    : undefined;
}

export function buildPaymentReportTabHref(
  query:
    ResolvedPaymentReportQuery,

  tab:
    PaymentReportTab,
) {
  return buildPaymentReportsHref({
    ...query,
    tab,
  });
}