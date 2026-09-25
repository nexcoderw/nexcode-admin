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
  PaymentStatement,
} from "@/components/payment/PaymentStatement/PaymentStatement";
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
  getPortfolioPaymentStatement,
} from "@/endpoints/payment/get-portfolio-statement";
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
      "Payment Statement",
  };

interface StatementPageProps {
  params:
    Promise<{
      portfolioId: string;
    }>;
}

export default async function StatementPage({
  params,
}: StatementPageProps) {
  const context =
    await getPaymentServerContext();

  if (!context) {
    redirect(
      AUTH_ROUTES.login,
    );
  }

  const {
    portfolioId:
      rawId,
  } = await params;

  const portfolioId =
    parsePaymentId(
      rawId
    );

  if (!portfolioId) {
    notFound();
  }

  const result =
    await getPortfolioPaymentStatement(
      portfolioId,
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
        title="Statement unavailable"
      >
        This Portfolio statement could not be loaded.
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
            PAYMENT_ROUTES.reports
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
          Reports
        </Button>

        <PaymentPrintAction
          pdfHref={
            `${PAYMENT_API_ROUTES.reportStatement(
              portfolioId,
            )}?format=pdf`
          }
        />
      </nav>

      <PaymentStatement
        statement={
          result.data
        }
      />
    </div>
  );
}