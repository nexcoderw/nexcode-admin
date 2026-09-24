import { ArrowLeft01Icon, Edit02Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";

import { DeleteAgreementDialog } from "@/components/payment/DeleteAgreementDialog/DeleteAgreementDialog";
import { PaymentAgreementDetail } from "@/components/payment/PaymentAgreementDetail/PaymentAgreementDetail";
import { PaymentDetailTabs } from "@/components/payment/PaymentDetailTabs/PaymentDetailTabs";
import { PaymentInstallmentTimeline } from "@/components/payment/PaymentInstallmentTimeline/PaymentInstallmentTimeline";
import { PaymentNotificationPanel } from "@/components/payment/PaymentNotificationPanel/PaymentNotificationPanel";
import { PaymentRecordList } from "@/components/payment/PaymentRecordList/PaymentRecordList";
import { PaymentReminderPanel } from "@/components/payment/PaymentReminderPanel/PaymentReminderPanel";
import { PaymentScheduleBuilder } from "@/components/payment/PaymentScheduleBuilder/PaymentScheduleBuilder";
import { PaymentSummaryCards } from "@/components/payment/PaymentSummaryCards/PaymentSummaryCards";
import { RecordPaymentDialog } from "@/components/payment/RecordPaymentDialog/RecordPaymentDialog";
import { Alert } from "@/components/ui/Alert/Alert";
import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { AUTH_ROUTES } from "@/constants/routes/auth-routes";
import { ERROR_ROUTES } from "@/constants/routes/error-routes";
import { PAYMENT_ROUTES } from "@/constants/routes/payment-routes";
import { loadPaymentDetail } from "@/utils/payment/payment-detail-data";
import {
  PAYMENT_DETAIL_TABS,
  type PaymentDetailTab,
  resolvePaymentDetailTab,
} from "@/utils/payment/payment-detail-tabs";
import { parsePaymentId } from "@/utils/payment/payment-id";
import { getPaymentServerContext } from "@/utils/payment/payment-server-data";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Payment Agreement",
};

interface PaymentDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

type PaymentDetail = Awaited<ReturnType<typeof loadPaymentDetail>>;
type LoadedDetail = PaymentDetail & {
  agreement: NonNullable<PaymentDetail["agreement"]>;
};

export default async function PaymentDetailPage({
  params,
  searchParams,
}: PaymentDetailPageProps) {
  const context = await getPaymentServerContext();

  if (!context) {
    redirect(AUTH_ROUTES.login);
  }

  const agreementId = parsePaymentId((await params).id);

  if (!agreementId) {
    notFound();
  }

  const tab = resolvePaymentDetailTab((await searchParams).tab);
  const detail = await loadPaymentDetail(agreementId, context);

  if (detail.status === 404) {
    notFound();
  }

  if (detail.status === 401) {
    redirect(ERROR_ROUTES.unauthorized);
  }

  if (detail.status === 403) {
    redirect(ERROR_ROUTES.forbidden);
  }

  if (!detail.agreement) {
    return (
      <Alert variant="error" title="Agreement unavailable">
        This payment agreement could not be loaded.
      </Alert>
    );
  }

  const loaded = detail as LoadedDetail;
  const { agreement, installments, summary } = loaded;
  const label = PAYMENT_DETAIL_TABS.find((item) => item.id === tab)!.label;

  return (
    <div className={styles.page}>
      <nav className={styles.actions} aria-label="Payment agreement actions">
        <Button
          href={PAYMENT_ROUTES.list}
          variant="ghost"
          size="sm"
          leftIcon={<Icon icon={ArrowLeft01Icon} size={16} />}
        >
          Payments
        </Button>

        <div className={styles.primaryActions}>
          <Button
            href={PAYMENT_ROUTES.edit(agreement.id)}
            size="sm"
            variant="secondary"
            leftIcon={<Icon icon={Edit02Icon} size={16} />}
          >
            Edit agreement
          </Button>

          <RecordPaymentDialog agreement={agreement} installments={installments} />

          {/* Only an unused draft can be deleted, so only a draft offers it. */}
          {agreement.status === "draft" && (
            <DeleteAgreementDialog
              agreementId={agreement.id}
              title={agreement.title}
              disabled={false}
            />
          )}
        </div>
      </nav>

      <PaymentAgreementDetail agreement={agreement} />

      {summary && (
        <PaymentSummaryCards summary={summary} currency={agreement.currency} />
      )}

      <PaymentDetailTabs
        agreementId={agreement.id}
        active={tab}
        counts={{
          schedule: installments.length,
          payments: loaded.records.length,
          reminders: loaded.rules.length,
          notifications: loaded.notifications.filter((item) => !item.isRead)
            .length,
        }}
        highlight={["notifications"]}
      />

      <section className={styles.panel} aria-label={label}>
        {renderTab(tab, loaded)}
      </section>
    </div>
  );
}

function renderTab(tab: PaymentDetailTab, detail: LoadedDetail): ReactNode {
  const { agreement, installments } = detail;

  switch (tab) {
    case "payments":
      return <PaymentRecordList records={detail.records} />;

    case "reminders":
      // A form and a short list: narrower and centred reads better.
      return (
        <div className={styles.narrow}>
          <PaymentReminderPanel agreementId={agreement.id} rules={detail.rules} />
        </div>
      );

    case "notifications":
      return <PaymentNotificationPanel notifications={detail.notifications} />;

    default:
      // Before a schedule exists, the builder is the next step; after,
      // the timeline is what the admin comes back for.
      return installments.length === 0 ? (
        <PaymentScheduleBuilder agreement={agreement} hasSchedule={false} />
      ) : (
        <PaymentInstallmentTimeline
          // Latest first, the oldest at the bottom.
          installments={[...installments].reverse()}
          currency={agreement.currency}
        />
      );
  }
}
