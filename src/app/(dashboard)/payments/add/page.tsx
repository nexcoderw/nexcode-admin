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
  PaymentAgreementForm,
} from "@/components/payment/PaymentAgreementForm/PaymentAgreementForm";
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
  getPaymentServerContext,
  listPaymentPortfolios,
} from "@/utils/payment/payment-server-data";

import styles from "./page.module.css";

export const metadata:
  Metadata = {
    title:
      "Add Payment Agreement",
  };

export default async function AddPaymentAgreementPage() {
  const context =
    await getPaymentServerContext();

  if (!context) {
    redirect(
      AUTH_ROUTES.login,
    );
  }

  const portfolios =
    await listPaymentPortfolios(
      context,
    );

  if (
    portfolios.status ===
    401
  ) {
    redirect(
      ERROR_ROUTES.unauthorized,
    );
  }

  if (
    portfolios.status ===
    403
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
        <Button
          href={
            PAYMENT_ROUTES.list
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
          Payments
        </Button>

        <div>
          <span>
            Financial management
          </span>

          <h1>
            Add payment agreement
          </h1>

          <p>
            Create the financial agreement first. Its installment schedule,
            transactions and reminders are managed from the agreement page.
          </p>
        </div>
      </header>

      {!portfolios.ok ? (
        <Alert
          variant="error"
          title="Portfolios unavailable"
        >
          Portfolio choices could not be loaded.
        </Alert>
      ) : portfolios
          .items.length ===
        0 ? (
        <Alert
          variant="warning"
          title="No Portfolios available"
        >
          A payment agreement must belong to a Portfolio.
        </Alert>
      ) : (
        <PaymentAgreementForm
          mode="add"
          portfolios={
            portfolios.items
          }
        />
      )}
    </div>
  );
}