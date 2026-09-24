import type {
  Metadata,
} from "next";
import {
  redirect,
} from "next/navigation";

import {
  PaymentAgreementList,
} from "@/components/payment/PaymentAgreementList/PaymentAgreementList";
import {
  PaymentHeader,
} from "@/components/payment/PaymentHeader/PaymentHeader";
import {
  Alert,
} from "@/components/ui/Alert/Alert";
import {
  AUTH_ROUTES,
} from "@/constants/routes/auth-routes";
import {
  ERROR_ROUTES,
} from "@/constants/routes/error-routes";
import {
  listPaymentAgreements,
} from "@/endpoints/payment/list-agreements";
import {
  resolvePaymentAgreementQuery,
  toPaymentAgreementEndpointQuery,
} from "@/utils/payment/payment-page-query";
import {
  getPaymentServerContext,
  listPaymentPortfolios,
} from "@/utils/payment/payment-server-data";

import styles from "./page.module.css";

export const metadata:
  Metadata = {
    title: "Payments",
  };

interface PaymentPageProps {
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

export default async function PaymentPage({
  searchParams,
}: PaymentPageProps) {
  const context =
    await getPaymentServerContext();

  if (!context) {
    redirect(
      AUTH_ROUTES.login,
    );
  }

  const query =
    resolvePaymentAgreementQuery(
      await searchParams,
    );

  const [
    agreementResult,
    portfolioResult,
  ] = await Promise.all([
    listPaymentAgreements(
      context.sessionId,
      context.forwarded,
      toPaymentAgreementEndpointQuery(
        query,
      ),
    ),

    listPaymentPortfolios(
      context,
    ),
  ]);

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

  const data =
    agreementResult.ok
      ? agreementResult.data
      : null;

  const filtered =
    Boolean(query.search) ||
    Boolean(
      query.portfolioId,
    ) ||
    Boolean(
      query.agreementType,
    ) ||
    Boolean(query.status) ||
    Boolean(query.currency) ||
    query.ordering !==
      "-created_at";

  return (
    <div
      className={
        styles.page
      }
    >
      <PaymentHeader
        query={query}
        portfolios={
          portfolioResult.ok
            ? portfolioResult.items
            : []
        }
      />

      {!data ? (
        <Alert
          variant="error"
          title="Payments unavailable"
        >
          Payment agreement information could not be loaded.
        </Alert>
      ) : (
        <PaymentAgreementList
          data={data}
          query={query}
          filtered={filtered}
        />
      )}
    </div>
  );
}