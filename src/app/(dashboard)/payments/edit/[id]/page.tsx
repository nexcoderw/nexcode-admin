import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { DeleteAgreementDialog } from "@/components/payment/DeleteAgreementDialog/DeleteAgreementDialog";
import { PaymentAgreementForm } from "@/components/payment/PaymentAgreementForm/PaymentAgreementForm";
import { PaymentFormHeader } from "@/components/payment/PaymentFormHeader/PaymentFormHeader";
import { Alert } from "@/components/ui/Alert/Alert";
import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { AUTH_ROUTES } from "@/constants/routes/auth-routes";
import { ERROR_ROUTES } from "@/constants/routes/error-routes";
import { PAYMENT_ROUTES } from "@/constants/routes/payment-routes";
import { getPaymentAgreement } from "@/endpoints/payment/get-agreement";
import { parsePaymentId } from "@/utils/payment/payment-id";
import {
  getPaymentServerContext,
  listPaymentPortfolios,
} from "@/utils/payment/payment-server-data";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Edit Payment Agreement",
};

interface EditPaymentPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}

export default async function EditPaymentPage({
  params,
  searchParams,
}: EditPaymentPageProps) {
  const context = await getPaymentServerContext();

  if (!context) {
    redirect(AUTH_ROUTES.login);
  }

  const agreementId = parsePaymentId((await params).id);

  if (!agreementId) {
    notFound();
  }

  const [agreementResult, portfolios, query] = await Promise.all([
    getPaymentAgreement(agreementId, context.sessionId, context.forwarded),
    listPaymentPortfolios(context),
    searchParams,
  ]);

  if (agreementResult.status === 404) {
    notFound();
  }

  if (agreementResult.status === 401) {
    redirect(ERROR_ROUTES.unauthorized);
  }

  if (agreementResult.status === 403) {
    redirect(ERROR_ROUTES.forbidden);
  }

  if (!agreementResult.ok || !agreementResult.data) {
    return (
      <Alert variant="error" title="Agreement unavailable">
        This payment agreement could not be loaded.
      </Alert>
    );
  }

  const agreement = agreementResult.data;

  return (
    <div className={styles.page}>
      <PaymentFormHeader
        backHref={PAYMENT_ROUTES.detail(agreement.id)}
        backLabel={agreement.title}
        title="Edit agreement"
        description={`${agreement.portfolio.name} · Changes apply to this agreement only.`}
        actions={
          <>
            <Button
              href={PAYMENT_ROUTES.detail(agreement.id)}
              variant="secondary"
              size="sm"
              rightIcon={<Icon icon={ArrowRight01Icon} size={16} />}
            >
              View details
            </Button>

            {/* Only an unused draft can be deleted, so only a draft offers it. */}
            {agreement.status === "draft" && (
              <DeleteAgreementDialog
                agreementId={agreement.id}
                title={agreement.title}
                disabled={false}
              />
            )}
          </>
        }
      />

      {query.created === "1" && (
        <Alert variant="success" title="Agreement created">
          Next, set up its schedule, payments and reminders from the details
          page.
        </Alert>
      )}

      <PaymentAgreementForm
        mode="edit"
        agreement={agreement}
        portfolios={
          portfolios.ok
            ? portfolios.items
            : // Without the list, the agreement's own portfolio is still
              // offered so the form keeps its current value.
              [{ id: agreement.portfolio.id, name: agreement.portfolio.name }]
        }
      />
    </div>
  );
}
