import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PaymentAgreementForm } from "@/components/payment/PaymentAgreementForm/PaymentAgreementForm";
import { PaymentFormHeader } from "@/components/payment/PaymentFormHeader/PaymentFormHeader";
import { Alert } from "@/components/ui/Alert/Alert";
import { AUTH_ROUTES } from "@/constants/routes/auth-routes";
import { ERROR_ROUTES } from "@/constants/routes/error-routes";
import { PAYMENT_ROUTES } from "@/constants/routes/payment-routes";
import {
  getPaymentServerContext,
  listPaymentPortfolios,
} from "@/utils/payment/payment-server-data";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Add Payment Agreement",
};

export default async function AddPaymentAgreementPage() {
  const context = await getPaymentServerContext();

  if (!context) {
    redirect(AUTH_ROUTES.login);
  }

  const portfolios = await listPaymentPortfolios(context);

  if (portfolios.status === 401) {
    redirect(ERROR_ROUTES.unauthorized);
  }

  if (portfolios.status === 403) {
    redirect(ERROR_ROUTES.forbidden);
  }

  return (
    <div className={styles.page}>
      <PaymentFormHeader
        backHref={PAYMENT_ROUTES.list}
        backLabel="Payments"
        title="New payment agreement"
        description="Set up the agreement first. Its schedule, payments and reminders follow on its own page."
      />

      {!portfolios.ok ? (
        <Alert variant="error" title="Portfolios unavailable">
          Portfolio choices could not be loaded.
        </Alert>
      ) : portfolios.items.length === 0 ? (
        <Alert variant="warning" title="No portfolios yet">
          A payment agreement must belong to a portfolio. Add a portfolio
          first.
        </Alert>
      ) : (
        <PaymentAgreementForm mode="add" portfolios={portfolios.items} />
      )}
    </div>
  );
}
