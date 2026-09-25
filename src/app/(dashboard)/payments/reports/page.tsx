import {
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";
import type {
  Metadata,
} from "next";
import {
  redirect,
} from "next/navigation";

import {
  PaymentCollectionsTable,
} from "@/components/payment/PaymentCollectionsTable/PaymentCollectionsTable";
import {
  PaymentOutstandingTable,
} from "@/components/payment/PaymentOutstandingTable/PaymentOutstandingTable";
import {
  PaymentReportFilter,
} from "@/components/payment/PaymentReportFilter/PaymentReportFilter";
import {
  PaymentReportingDashboard,
} from "@/components/payment/PaymentReportingDashboard/PaymentReportingDashboard";
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
  getPaymentCollectionsReport,
} from "@/endpoints/payment/get-collections-report";
import {
  getPaymentOutstandingReport,
} from "@/endpoints/payment/get-outstanding-report";
import {
  getPaymentReportOverview,
} from "@/endpoints/payment/get-report-overview";
import {
  resolvePaymentReportQuery,
} from "@/utils/payment/report-query";
import {
  getPaymentServerContext,
  listPaymentPortfolios,
} from "@/utils/payment/payment-server-data";

import styles from "./page.module.css";

export const metadata:
  Metadata = {
    title:
      "Payment Reports",
  };

interface PaymentReportsPageProps {
  searchParams:
    Promise<
      Record<
        string,
        string |
        string[] |
        undefined
      >
    >;
}

export default async function PaymentReportsPage({
  searchParams,
}: PaymentReportsPageProps) {
  const context =
    await getPaymentServerContext();

  if (!context) {
    redirect(
      AUTH_ROUTES.login,
    );
  }

  const query =
    resolvePaymentReportQuery(
      await searchParams,
    );

  const [
    overview,
    collections,
    outstanding,
    portfolios,
  ] = await Promise.all([
    getPaymentReportOverview(
      context.sessionId,
      context.forwarded,
      query,
    ),

    getPaymentCollectionsReport(
      context.sessionId,
      context.forwarded,
      query,
    ),

    getPaymentOutstandingReport(
      context.sessionId,
      context.forwarded,
      query,
    ),

    listPaymentPortfolios(
      context,
    ),
  ]);

  const status = [
    overview.status,
    collections.status,
    outstanding.status,
  ];

  if (
    status.includes(401)
  ) {
    redirect(
      ERROR_ROUTES.unauthorized,
    );
  }

  if (
    status.includes(403)
  ) {
    redirect(
      ERROR_ROUTES.forbidden,
    );
  }

  return (
    <div
      className={
        styles.page
      }
    >
      <header
        className={
          styles.header
        }
      >
        <div>
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

          <span>
            Financial reporting
          </span>

          <h1>
            Payment reports
          </h1>

          <p>
            Review collections, outstanding obligations and overdue balances
            without combining different currencies.
          </p>
        </div>

        <PaymentReportFilter
          query={query}
          portfolios={
            portfolios.ok
              ? portfolios.items
              : []
          }
        />
      </header>

      {!overview.ok ||
      !overview.data ? (
        <Alert
          variant="error"
          title="Financial overview unavailable"
        >
          The financial position could not be loaded.
        </Alert>
      ) : (
        <PaymentReportingDashboard
          overview={
            overview.data
          }
        />
      )}

      {collections.ok &&
      collections.data ? (
        <PaymentCollectionsTable
          report={
            collections.data
          }
          query={query}
        />
      ) : (
        <Alert
          variant="error"
          title="Collections unavailable"
        >
          Monthly collections could not be loaded.
        </Alert>
      )}

      {outstanding.ok &&
      outstanding.data ? (
        <PaymentOutstandingTable
          report={
            outstanding.data
          }
          query={query}
        />
      ) : (
        <Alert
          variant="error"
          title="Outstanding report unavailable"
        >
          Outstanding obligations could not be loaded.
        </Alert>
      )}
    </div>
  );
}