import "server-only";

import {
  PAYMENT_CURRENCIES,
  PAYMENT_METHODS,
  PAYMENT_RECORD_STATUSES,
} from "@/constants/payment/payment-query";
import {
  asRecord,
  isNullableString,
  isNumber,
  isOneOf,
  isString,
} from "@/endpoints/payment/mapper-utils";
import type {
  PaymentCollectionsReport,
  PaymentOutstandingReport,
  PaymentPortfolioStatement,
  PaymentReceipt,
  PaymentReportOverview,
} from "@/types/payment/report";

const PAYMENT_STATES = [
  "unpaid",
  "partial",
  "paid",
  "waived",
] as const;

const TIMING_STATES = [
  "upcoming",
  "due_today",
  "grace_period",
  "overdue",
  "awaiting_milestone",
  "settled",
] as const;

const OUTSTANDING_KINDS = [
  "all",
  "overdue",
  "due_soon",
] as const;

export function mapReportOverview(
  value: unknown,
): PaymentReportOverview | null {
  const item =
    asRecord(value);

  if (
    !item ||
    !isString(item.as_of) ||
    !isNumber(
      item.due_within_days,
    ) ||
    !Array.isArray(
      item.currencies,
    )
  ) {
    return null;
  }

  const currencies =
    item.currencies.map(
      mapCurrencyOverview,
    );

  if (
    currencies.some(
      (row) => !row,
    )
  ) {
    return null;
  }

  return {
    asOf: item.as_of,

    dueWithinDays:
      item.due_within_days,

    currencies:
      currencies as
        PaymentReportOverview[
          "currencies"
        ],
  };
}

export function mapCollectionsReport(
  value: unknown,
): PaymentCollectionsReport | null {
  const item =
    asRecord(value);

  if (
    !item ||
    !isNullableString(
      item.date_from,
    ) ||
    !isNullableString(
      item.date_to,
    ) ||
    !Array.isArray(
      item.rows,
    )
  ) {
    return null;
  }

  const rows =
    item.rows.map(
      (value) => {
        const row =
          asRecord(value);

        if (
          !row ||
          !isString(
            row.month,
          ) ||
          !isOneOf(
            row.currency,
            PAYMENT_CURRENCIES,
          ) ||
          !isString(
            row.amount,
          ) ||
          !isNumber(
            row.payment_count,
          )
        ) {
          return null;
        }

        return {
          month:
            row.month,

          currency:
            row.currency,

          amount:
            row.amount,

          paymentCount:
            row.payment_count,
        };
      },
    );

  if (
    rows.some(
      (row) => !row,
    )
  ) {
    return null;
  }

  return {
    dateFrom:
      item.date_from,

    dateTo:
      item.date_to,

    rows:
      rows as
        PaymentCollectionsReport[
          "rows"
        ],
  };
}

export function mapOutstandingReport(
  value: unknown,
): PaymentOutstandingReport | null {
  const item =
    asRecord(value);

  if (
    !item ||
    !isString(item.as_of) ||
    !isNumber(
      item.due_within_days,
    ) ||
    !isOneOf(
      item.kind,
      OUTSTANDING_KINDS,
    ) ||
    !Array.isArray(
      item.rows,
    )
  ) {
    return null;
  }

  const rows =
    item.rows.map(
      mapOutstandingRow,
    );

  if (
    rows.some(
      (row) => !row,
    )
  ) {
    return null;
  }

  return {
    asOf:
      item.as_of,

    dueWithinDays:
      item.due_within_days,

    kind:
      item.kind,

    rows:
      rows as
        PaymentOutstandingReport[
          "rows"
        ],
  };
}

export function mapPortfolioStatement(
  value: unknown,
): PaymentPortfolioStatement | null {
  const item =
    asRecord(value);

  const portfolio =
    asRecord(
      item?.portfolio,
    );

  if (
    !item ||
    !portfolio ||
    !isString(
      item.generated_at,
    ) ||
    !isNumber(
      portfolio.id,
    ) ||
    !isString(
      portfolio.name,
    ) ||
    !isString(
      portfolio.slug,
    ) ||
    !Array.isArray(
      item.currencies,
    ) ||
    !Array.isArray(
      item.agreements,
    ) ||
    !Array.isArray(
      item.payments,
    )
  ) {
    return null;
  }

  const currencies =
    item.currencies.map(
      mapStatementCurrency,
    );

  const agreements =
    item.agreements.map(
      mapStatementAgreement,
    );

  const payments =
    item.payments.map(
      mapStatementPayment,
    );

  if (
    currencies.some(
      (row) => !row,
    ) ||
    agreements.some(
      (row) => !row,
    ) ||
    payments.some(
      (row) => !row,
    )
  ) {
    return null;
  }

  return {
    generatedAt:
      item.generated_at,

    portfolio: {
      id: portfolio.id,
      name:
        portfolio.name,
      slug:
        portfolio.slug,
    },

    currencies:
      currencies as
        PaymentPortfolioStatement[
          "currencies"
        ],

    agreements:
      agreements as
        PaymentPortfolioStatement[
          "agreements"
        ],

    payments:
      payments as
        PaymentPortfolioStatement[
          "payments"
        ],
  };
}

export function mapPaymentReceipt(
  value: unknown,
): PaymentReceipt | null {
  const item =
    asRecord(value);

  const portfolio =
    asRecord(
      item?.portfolio,
    );

  const agreement =
    asRecord(
      item?.agreement,
    );

  const payment =
    asRecord(
      item?.payment,
    );

  if (
    !item ||
    !portfolio ||
    !agreement ||
    !payment ||
    !isString(
      item.receipt_number,
    ) ||
    !isString(
      item.issued_at,
    ) ||
    !isNumber(
      portfolio.id,
    ) ||
    !isString(
      portfolio.name,
    ) ||
    !isNumber(
      agreement.id,
    ) ||
    !isString(
      agreement.title,
    ) ||
    !isNullableString(
      agreement.reference,
    ) ||
    !isNumber(
      payment.id,
    ) ||
    !isString(
      payment.amount,
    ) ||
    !isOneOf(
      payment.currency,
      PAYMENT_CURRENCIES,
    ) ||
    !isString(
      payment.paid_at,
    ) ||
    !isOneOf(
      payment.payment_method,
      PAYMENT_METHODS,
    ) ||
    !isNullableString(
      payment.reference,
    ) ||
    !isOneOf(
      payment.status,
      PAYMENT_RECORD_STATUSES,
    ) ||
    !isNullableString(
      payment.voided_at,
    ) ||
    !isNullableString(
      payment.void_reason,
    ) ||
    !isNullableString(
      payment.recorded_by,
    ) ||
    !Array.isArray(
      item.allocations,
    )
  ) {
    return null;
  }

  const allocations =
    item.allocations.map(
      (value) => {
        const row =
          asRecord(value);

        if (
          !row ||
          !isNumber(
            row.installment_id,
          ) ||
          !isString(
            row.installment_title,
          ) ||
          !isString(
            row.amount,
          )
        ) {
          return null;
        }

        return {
          installmentId:
            row.installment_id,

          installmentTitle:
            row.installment_title,

          amount:
            row.amount,
        };
      },
    );

  if (
    allocations.some(
      (row) => !row,
    )
  ) {
    return null;
  }

  return {
    receiptNumber:
      item.receipt_number,

    issuedAt:
      item.issued_at,

    portfolio: {
      id: portfolio.id,
      name:
        portfolio.name,
    },

    agreement: {
      id: agreement.id,
      title:
        agreement.title,

      reference:
        agreement.reference,
    },

    payment: {
      id: payment.id,
      amount:
        payment.amount,

      currency:
        payment.currency,

      paidAt:
        payment.paid_at,

      paymentMethod:
        payment.payment_method,

      reference:
        payment.reference,

      status:
        payment.status,

      voidedAt:
        payment.voided_at,

      voidReason:
        payment.void_reason,

      recordedBy:
        payment.recorded_by,
    },

    allocations:
      allocations as
        PaymentReceipt[
          "allocations"
        ],
  };
}

function mapCurrencyOverview(
  value: unknown,
) {
  const row =
    asRecord(value);

  if (
    !row ||
    !isOneOf(
      row.currency,
      PAYMENT_CURRENCIES,
    ) ||
    !moneyFields(
      row,
      [
        "total_contracted",
        "total_received",
        "outstanding",
        "overdue",
        "due_soon",
      ],
    ) ||
    !isNumber(
      row.agreement_count,
    ) ||
    !isNumber(
      row.active_agreement_count,
    )
  ) {
    return null;
  }

  return {
    currency:
      row.currency,

    totalContracted:
      row.total_contracted as string,

    totalReceived:
      row.total_received as string,

    outstanding:
      row.outstanding as string,

    overdue:
      row.overdue as string,

    dueSoon:
      row.due_soon as string,

    agreementCount:
      row.agreement_count,

    activeAgreementCount:
      row.active_agreement_count,
  };
}

function mapOutstandingRow(
  value: unknown,
) {
  const row =
    asRecord(value);

  const portfolio =
    asRecord(
      row?.portfolio,
    );

  if (
    !row ||
    !portfolio ||
    !isNumber(
      row.installment_id,
    ) ||
    !isNumber(
      row.agreement_id,
    ) ||
    !isString(
      row.agreement_title,
    ) ||
    !isNumber(
      portfolio.id,
    ) ||
    !isString(
      portfolio.name,
    ) ||
    !isString(
      row.title,
    ) ||
    !isOneOf(
      row.currency,
      PAYMENT_CURRENCIES,
    ) ||
    !moneyFields(
      row,
      [
        "amount",
        "paid_amount",
        "outstanding_amount",
      ],
    ) ||
    !isNullableString(
      row.due_date,
    ) ||
    !isString(
      row.expected_due_date,
    ) ||
    !isNullableString(
      row.effective_due_date,
    ) ||
    !isOneOf(
      row.payment_state,
      PAYMENT_STATES,
    ) ||
    !isOneOf(
      row.timing_state,
      TIMING_STATES,
    ) ||
    !(
      row.days_from_due ===
        null ||
      isNumber(
        row.days_from_due,
      )
    )
  ) {
    return null;
  }

  return {
    installmentId:
      row.installment_id,

    agreementId:
      row.agreement_id,

    agreementTitle:
      row.agreement_title,

    portfolio: {
      id: portfolio.id,
      name:
        portfolio.name,
    },

    title:
      row.title,

    currency:
      row.currency,

    amount:
      row.amount as string,

    paidAmount:
      row.paid_amount as string,

    outstandingAmount:
      row.outstanding_amount as string,

    dueDate:
      row.due_date,

    expectedDueDate:
      row.expected_due_date,

    effectiveDueDate:
      row.effective_due_date,

    paymentState:
      row.payment_state,

    timingState:
      row.timing_state,

    daysFromDue:
      row.days_from_due as
        number | null,
  };
}

function mapStatementCurrency(
  value: unknown,
) {
  const row =
    asRecord(value);

  if (
    !row ||
    !isOneOf(
      row.currency,
      PAYMENT_CURRENCIES,
    ) ||
    !moneyFields(
      row,
      [
        "total_contracted",
        "total_received",
        "outstanding",
      ],
    )
  ) {
    return null;
  }

  return {
    currency:
      row.currency,

    totalContracted:
      row.total_contracted as string,

    totalReceived:
      row.total_received as string,

    outstanding:
      row.outstanding as string,
  };
}

function mapStatementAgreement(
  value: unknown,
) {
  const row =
    asRecord(value);

  if (
    !row ||
    !isNumber(row.id) ||
    !isString(row.title) ||
    !isNullableString(
      row.reference,
    ) ||
    !isString(row.status) ||
    !isOneOf(
      row.currency,
      PAYMENT_CURRENCIES,
    ) ||
    !moneyFields(
      row,
      [
        "total_amount",
        "received_amount",
        "outstanding_amount",
      ],
    ) ||
    !isString(
      row.start_date,
    ) ||
    !isNullableString(
      row.end_date,
    )
  ) {
    return null;
  }

  return {
    id: row.id,
    title:
      row.title,

    reference:
      row.reference,

    status:
      row.status,

    currency:
      row.currency,

    totalAmount:
      row.total_amount as string,

    receivedAmount:
      row.received_amount as string,

    outstandingAmount:
      row.outstanding_amount as string,

    startDate:
      row.start_date,

    endDate:
      row.end_date,
  };
}

function mapStatementPayment(
  value: unknown,
) {
  const row =
    asRecord(value);

  if (
    !row ||
    !isNumber(row.id) ||
    !isString(
      row.receipt_number,
    ) ||
    !isNumber(
      row.agreement_id,
    ) ||
    !isString(
      row.agreement_title,
    ) ||
    !isOneOf(
      row.currency,
      PAYMENT_CURRENCIES,
    ) ||
    !isString(row.amount) ||
    !isString(row.paid_at) ||
    !isOneOf(
      row.status,
      PAYMENT_RECORD_STATUSES,
    ) ||
    !isOneOf(
      row.payment_method,
      PAYMENT_METHODS,
    ) ||
    !isNullableString(
      row.reference,
    )
  ) {
    return null;
  }

  return {
    id: row.id,

    receiptNumber:
      row.receipt_number,

    agreementId:
      row.agreement_id,

    agreementTitle:
      row.agreement_title,

    currency:
      row.currency,

    amount:
      row.amount,

    paidAt:
      row.paid_at,

    status:
      row.status,

    paymentMethod:
      row.payment_method,

    reference:
      row.reference,
  };
}

function moneyFields(
  value:
    Record<string, unknown>,

  fields:
    readonly string[],
) {
  return fields.every(
    (field) =>
      isString(
        value[field],
      ),
  );
}