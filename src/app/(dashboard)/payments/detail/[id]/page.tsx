import {
  ArrowLeft01Icon,
  Edit02Icon,
} from "@hugeicons/core-free-icons";
import type {
  Metadata,
} from "next";
import {
  notFound,
  redirect,
} from "next/navigation";

import {
  DeleteAgreementDialog,
} from "@/components/payment/DeleteAgreementDialog/DeleteAgreementDialog";
import {
  PaymentAgreementDetail,
} from "@/components/payment/PaymentAgreementDetail/PaymentAgreementDetail";
import {
  PaymentInstallmentTimeline,
} from "@/components/payment/PaymentInstallmentTimeline/PaymentInstallmentTimeline";
import {
  PaymentNotificationPanel,
} from "@/components/payment/PaymentNotificationPanel/PaymentNotificationPanel";
import {
  PaymentRecordList,
} from "@/components/payment/PaymentRecordList/PaymentRecordList";
import {
  PaymentReminderPanel,
} from "@/components/payment/PaymentReminderPanel/PaymentReminderPanel";
import {
  PaymentScheduleBuilder,
} from "@/components/payment/PaymentScheduleBuilder/PaymentScheduleBuilder";
import {
  PaymentSummaryCards,
} from "@/components/payment/PaymentSummaryCards/PaymentSummaryCards";
import {
  RecordPaymentDialog,
} from "@/components/payment/RecordPaymentDialog/RecordPaymentDialog";
import {
  Alert,
} from "@/components/ui/Alert/Alert";
import {
  Button,
} from "@/components/ui/Button/Button";
import {
  Icon,
} from "@/components/ui/Icon/Icon";
import {
  AUTH_ROUTES,
} from "@/constants/routes/auth-routes";
import {
  ERROR_ROUTES,
} from "@/constants/routes/error-routes";
import {
  PAYMENT_ROUTES,
} from "@/constants/routes/payment-routes";
import {
  getPaymentAgreement,
} from "@/endpoints/payment/get-agreement";
import {
  getAgreementFinancialSummary,
} from "@/endpoints/payment/get-agreement-summary";
import {
  listPaymentInstallments,
} from "@/endpoints/payment/list-installment";
import {
  listPaymentNotifications,
} from "@/endpoints/payment/list-notifications";
import {
  listPaymentRecords,
} from "@/endpoints/payment/list-records";
import {
  listPaymentReminderRules,
} from "@/endpoints/payment/list-reminder-rules";
import {
  parsePaymentId,
} from "@/utils/payment/payment-id";
import {
  getPaymentServerContext,
} from "@/utils/payment/payment-server-data";

import styles from "./page.module.css";

export const metadata:
  Metadata = {
    title:
      "Payment Agreement",
  };

interface PaymentDetailPageProps {
  params:
    Promise<{
      id: string;
    }>;
}

export default async function PaymentDetailPage({
  params,
}: PaymentDetailPageProps) {
  const context =
    await getPaymentServerContext();

  if (!context) {
    redirect(
      AUTH_ROUTES.login,
    );
  }

  const { id } =
    await params;

  const agreementId =
    parsePaymentId(id);

  if (!agreementId) {
    notFound();
  }

  const [
    agreementResult,
    installmentResult,
    summaryResult,
    recordResult,
    reminderResult,
    notificationResult,
  ] = await Promise.all([
    getPaymentAgreement(
      agreementId,
      context.sessionId,
      context.forwarded,
    ),

    listPaymentInstallments(
      agreementId,
      context.sessionId,
      context.forwarded,
    ),

    getAgreementFinancialSummary(
      agreementId,
      context.sessionId,
      context.forwarded,
    ),

    listPaymentRecords(
      context.sessionId,
      context.forwarded,
      {
        agreementId,
        pageSize: 100,
      },
    ),

    listPaymentReminderRules(
      context.sessionId,
      context.forwarded,
      {
        agreementId,
        pageSize: 100,
      },
    ),

    listPaymentNotifications(
      context.sessionId,
      context.forwarded,
      {
        agreementId,
        pageSize: 100,
      },
    ),
  ]);

  if (
    agreementResult.status ===
    404
  ) {
    notFound();
  }

  if (
    agreementResult.status ===
    401
  ) {
    redirect(
      ERROR_ROUTES.unauthorized,
    );
  }

  if (
    agreementResult.status ===
    403
  ) {
    redirect(
      ERROR_ROUTES.forbidden,
    );
  }

  if (
    !agreementResult.ok ||
    !agreementResult.data
  ) {
    return (
      <Alert
        variant="error"
        title="Agreement unavailable"
      >
        This payment agreement could not be loaded.
      </Alert>
    );
  }

  const agreement =
    agreementResult.data;

  const installments =
    installmentResult.ok &&
    installmentResult.data
      ? installmentResult.data
      : [];

  const records =
    recordResult.ok &&
    recordResult.data
      ? recordResult.data.items
      : [];

  const rules =
    reminderResult.ok &&
    reminderResult.data
      ? reminderResult.data.items
      : [];

  const notifications =
    notificationResult.ok &&
    notificationResult.data
      ? notificationResult
          .data.items
      : [];

  return (
    <div
      className={
        styles.page
      }
    >
      <nav
        className={
          styles.actions
        }
        aria-label="Payment agreement actions"
      >
        <Button
          href={
            PAYMENT_ROUTES.list
          }
          variant="ghost"
          size="sm"
          leftIcon={
            <Icon
              icon={
                ArrowLeft01Icon
              }
              size={16}
            />
          }
        >
          Payments
        </Button>

        <div>
          <Button
            href={
              PAYMENT_ROUTES.edit(
                agreement.id,
              )
            }
            size="sm"
            variant="secondary"
            leftIcon={
              <Icon
                icon={
                  Edit02Icon
                }
                size={16}
              />
            }
          >
            Edit agreement
          </Button>

          <RecordPaymentDialog
            agreement={
              agreement
            }
            installments={
              installments
            }
          />
        </div>
      </nav>

      <PaymentAgreementDetail
        agreement={
          agreement
        }
      />

      {summaryResult.ok &&
        summaryResult.data && (
        <PaymentSummaryCards
          summary={
            summaryResult.data
          }
          currency={
            agreement.currency
          }
        />
      )}

      <div
        className={
          styles.layout
        }
      >
        <main
          className={
            styles.main
          }
        >
          <PaymentInstallmentTimeline
            installments={
              installments
            }
            currency={
              agreement.currency
            }
          />

          <PaymentRecordList
            records={
              records
            }
          />

          <PaymentNotificationPanel
            notifications={
              notifications
            }
          />
        </main>

        <aside
          className={
            styles.sidebar
          }
        >
          <PaymentScheduleBuilder
            agreement={
              agreement
            }
            hasSchedule={
              installments.length >
              0
            }
          />

          <PaymentReminderPanel
            agreementId={
              agreement.id
            }
            rules={rules}
          />
        </aside>
      </div>

      <section
        className={
          styles.danger
        }
      >
        <div>
          <h2>
            Delete agreement
          </h2>

          <p>
            Only an unused draft agreement can be deleted. Financial history
            must otherwise remain intact.
          </p>
        </div>

        <DeleteAgreementDialog
          agreementId={
            agreement.id
          }
          title={
            agreement.title
          }
          disabled={
            agreement.status !==
            "draft"
          }
        />
      </section>
    </div>
  );
}