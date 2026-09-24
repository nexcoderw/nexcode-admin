"use client";

import { Tick02Icon } from "@hugeicons/core-free-icons";

import { PaymentFormSection } from "@/components/payment/PaymentFormSection/PaymentFormSection";
import { Alert } from "@/components/ui/Alert/Alert";
import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { Input } from "@/components/ui/Input/Input";
import { Select } from "@/components/ui/Select/Select";
import { Textarea } from "@/components/ui/Textarea/Textarea";
import {
  AGREEMENT_STATUS_OPTIONS,
  AGREEMENT_TYPE_OPTIONS,
  CURRENCY_OPTIONS,
} from "@/constants/payment/payment-options";
import { PAYMENT_ROUTES } from "@/constants/routes/payment-routes";
import { usePaymentAgreementForm } from "@/hooks/payment/use-payment-agreement-form";
import type {
  PaymentAgreement,
  PaymentAgreementStatus,
  PaymentAgreementType,
  PaymentCurrency,
} from "@/types/payment";

import styles from "./PaymentAgreementForm.module.css";

interface PortfolioChoice {
  id: number;
  name: string;
}

interface PaymentAgreementFormProps {
  mode: "add" | "edit";
  agreement?: PaymentAgreement;
  portfolios: PortfolioChoice[];
}

export function PaymentAgreementForm({
  mode,
  agreement,
  portfolios,
}: PaymentAgreementFormProps) {
  const form = usePaymentAgreementForm({
    mode,
    agreement,
    defaultPortfolioId: portfolios[0]?.id,
  });

  const { values, setValue, fieldError } = form;
  const maintenance = values.agreementType === "maintenance";

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        void form.submit();
      }}
    >
      {form.error && (
        <Alert variant="error" title="Unable to save agreement">
          {form.error}
        </Alert>
      )}

      {form.saved && (
        <Alert variant="success" title="Agreement saved">
          Your changes have been saved.
        </Alert>
      )}

      <PaymentFormSection
        title="Agreement"
        description="The portfolio it belongs to and how it is identified."
      >
        <Select
          label="Portfolio"
          required
          value={String(values.portfolioId)}
          options={portfolios.map((portfolio) => ({
            value: String(portfolio.id),
            label: portfolio.name,
          }))}
          error={fieldError("portfolioId", "Choose a portfolio.")}
          onChange={(event) => setValue("portfolioId", Number(event.target.value))}
        />

        <Input
          label="Title"
          required
          value={values.title}
          placeholder="Website development contract"
          error={fieldError("title", "Enter an agreement title.")}
          onChange={(event) => setValue("title", event.target.value)}
        />

        <Input
          label="Reference"
          showOptional
          value={values.reference}
          placeholder="NEX-2026-001"
          onChange={(event) => setValue("reference", event.target.value)}
        />

        <Select
          label="Type"
          value={values.agreementType}
          options={[...AGREEMENT_TYPE_OPTIONS]}
          error={fieldError("agreementType", "Choose an agreement type.")}
          onChange={(event) =>
            setValue("agreementType", event.target.value as PaymentAgreementType)
          }
        />
      </PaymentFormSection>

      <PaymentFormSection
        title="Terms"
        description="The agreed value, stored exactly as entered."
      >
        <Input
          label="Total amount"
          required
          inputMode="decimal"
          value={values.totalAmount}
          placeholder="5000000.00"
          error={fieldError("totalAmount", "Enter a valid positive amount.")}
          onChange={(event) => setValue("totalAmount", event.target.value)}
        />

        <Select
          label="Currency"
          value={values.currency}
          options={[...CURRENCY_OPTIONS]}
          onChange={(event) =>
            setValue("currency", event.target.value as PaymentCurrency)
          }
        />

        <Select
          label="Status"
          value={values.status}
          options={[...AGREEMENT_STATUS_OPTIONS]}
          onChange={(event) =>
            setValue("status", event.target.value as PaymentAgreementStatus)
          }
        />
      </PaymentFormSection>

      <PaymentFormSection
        title="Dates"
        description="When it was signed, when it starts and, if known, ends."
      >
        <Input
          type="date"
          label="Signed on"
          required
          value={values.agreementDate}
          error={fieldError("agreementDate", "Enter the signing date.")}
          onChange={(event) => setValue("agreementDate", event.target.value)}
        />

        <Input
          type="date"
          label="Starts"
          required
          value={values.startDate}
          error={fieldError("startDate", "Enter the start date.")}
          onChange={(event) => setValue("startDate", event.target.value)}
        />

        <Input
          type="date"
          label="Ends"
          required={maintenance}
          showOptional={!maintenance}
          min={values.startDate || undefined}
          value={values.endDate}
          error={fieldError(
            "endDate",
            maintenance
              ? "Maintenance agreements need an end date after the start."
              : "Enter an end date after the start.",
          )}
          onChange={(event) => setValue("endDate", event.target.value)}
        />
      </PaymentFormSection>

      <PaymentFormSection
        title="Notes"
        description="Internal, never shown to clients."
        wide
      >
        <Textarea
          label="Notes"
          showOptional
          rows={3}
          value={values.notes}
          placeholder="Anything the team should know about this agreement"
          onChange={(event) => setValue("notes", event.target.value)}
        />
      </PaymentFormSection>

      <footer className={styles.actions}>
        <Button
          href={
            mode === "edit" && agreement
              ? PAYMENT_ROUTES.detail(agreement.id)
              : PAYMENT_ROUTES.list
          }
          variant="ghost"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          isLoading={form.pending}
          loadingLabel="Saving agreement"
          leftIcon={<Icon icon={Tick02Icon} size={17} />}
        >
          {mode === "add" ? "Create agreement" : "Save changes"}
        </Button>
      </footer>
    </form>
  );
}
