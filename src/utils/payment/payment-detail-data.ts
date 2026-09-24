import "server-only";

import { getPaymentAgreement } from "@/endpoints/payment/get-agreement";
import { getAgreementFinancialSummary } from "@/endpoints/payment/get-agreement-summary";
import { listPaymentInstallments } from "@/endpoints/payment/list-installment";
import { listPaymentNotifications } from "@/endpoints/payment/list-notifications";
import { listPaymentRecords } from "@/endpoints/payment/list-records";
import { listPaymentReminderRules } from "@/endpoints/payment/list-reminder-rules";
import type { PaymentServerContext } from "@/utils/payment/payment-server-data";

/**
 * Everything the agreement page shows, fetched in parallel. Each tab
 * also shows a count, so every section loads together; a section that
 * fails comes back empty rather than failing the page.
 */
export async function loadPaymentDetail(
  agreementId: number,
  context: PaymentServerContext,
) {
  const { sessionId, forwarded } = context;
  const scoped = { agreementId, pageSize: 100 };

  const [agreement, installments, summary, records, rules, notifications] =
    await Promise.all([
      getPaymentAgreement(agreementId, sessionId, forwarded),
      listPaymentInstallments(agreementId, sessionId, forwarded),
      getAgreementFinancialSummary(agreementId, sessionId, forwarded),
      listPaymentRecords(sessionId, forwarded, {
        ...scoped,
        ordering: "-paid_at",
      }),
      listPaymentReminderRules(sessionId, forwarded, scoped),
      listPaymentNotifications(sessionId, forwarded, scoped),
    ]);

  return {
    status: agreement.status,
    agreement: agreement.ok ? agreement.data : null,
    summary: summary.ok ? summary.data : null,
    // In due order: forms such as the payment allocation list read them
    // first to last. The schedule tab shows them latest first.
    installments: (installments.ok && installments.data) || [],
    // Latest payment first, the oldest at the bottom.
    records: [...((records.ok && records.data?.items) || [])].sort(
      (a, b) => Date.parse(b.paidAt) - Date.parse(a.paidAt),
    ),
    rules: (rules.ok && rules.data?.items) || [],
    notifications: (notifications.ok && notifications.data?.items) || [],
  };
}
