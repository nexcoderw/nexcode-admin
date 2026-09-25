import {
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";
import type {
  Metadata,
} from "next";
import {
  notFound,
  redirect,
} from "next/navigation";

import {
  PaymentPrintAction,
} from "@/components/payment/PaymentPrintAction/PaymentPrintAction";
import {
  PaymentReceipt,
} from "@/components/payment/PaymentReceipt/PaymentReceipt";
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
  PAYMENT_API_ROUTES,
  PAYMENT_ROUTES,
} from "@/constants/routes/payment-routes";
import {
  getPaymentReceipt,
} from "@/endpoints/payment/get-payment-receipt";
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
      "Payment Receipt",
  };

interface ReceiptPageProps {
  params:
    Promise<{
      paymentId: string;
    }>;
}

export default async function ReceiptPage({
  params,
}: ReceiptPageProps) {
  const context =
    await getPaymentServerContext();

  if (!context) {
    redirect(
      AUTH_ROUTES.login,
    );
  }

  const {
    paymentId:
      rawId,
  } = await params;

  const paymentId =
    parsePaymentId(
      rawId
    );

  if (!paymentId) {
    notFound();
  }

  const result =
    await getPaymentReceipt(
      paymentId,
      context.sessionId,
      context.forwarded,
    );

  if (
    result.status === 404
  ) {
    notFound();
  }

  if (
    result.status === 401
  ) {
    redirect(
      ERROR_ROUTES.unauthorized,
    );
  }

  if (
    result.status === 403
  ) {
    redirect(
      ERROR_ROUTES.forbidden,
    );
  }

  if (
    !result.ok ||
    !result.data
  ) {
    return (
      <Alert
        variant="error"
        title="Receipt unavailable"
      >
        This payment receipt could not be loaded.
      </Alert>
    );
  }

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
      >
        <Button
          href={
            PAYMENT_ROUTES.detail(
              result.data
                .agreement.id,
            )
          }
          variant="ghost"
          leftIcon={
            <Icon
              icon={
                ArrowLeft01Icon
              }
              size={17}
            />
          }
        >
          Agreement
        </Button>

        <PaymentPrintAction
          pdfHref={
            `${PAYMENT_API_ROUTES.reportReceipt(
              paymentId,
            )}?format=pdf`
          }
        />
      </nav>

      <PaymentReceipt
        receipt={
          result.data
        }
      />
    </div>
  );
}