"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  PAYMENT_API_ROUTES,
  PAYMENT_ROUTES,
} from "@/constants/routes/payment-routes";
import { usePaymentMutation } from "@/hooks/payment/use-payment-mutation";
import type {
  PaymentAgreement,
  PaymentAgreementStatus,
  PaymentAgreementType,
  PaymentCurrency,
} from "@/types/payment";

export interface PaymentAgreementFormValues {
  portfolioId: number;
  title: string;
  reference: string;
  agreementType: PaymentAgreementType;
  currency: PaymentCurrency;
  totalAmount: string;
  agreementDate: string;
  startDate: string;
  endDate: string;
  status: PaymentAgreementStatus;
  notes: string;
}

interface UsePaymentAgreementFormOptions {
  mode: "add" | "edit";
  agreement?: PaymentAgreement;
  defaultPortfolioId?: number;
}

/**
 * The agreement form's values and saving. Adding opens the new
 * agreement's edit page; editing stays put and reports success.
 */
export function usePaymentAgreementForm({
  mode,
  agreement,
  defaultPortfolioId,
}: UsePaymentAgreementFormOptions) {
  const router = useRouter();
  const mutation = usePaymentMutation();
  const [saved, setSaved] = useState(false);

  const [values, setValues] = useState<PaymentAgreementFormValues>(() => ({
    portfolioId: agreement?.portfolio.id ?? defaultPortfolioId ?? 0,
    title: agreement?.title ?? "",
    reference: agreement?.reference ?? "",
    agreementType: agreement?.agreementType ?? "project",
    currency: agreement?.currency ?? "RWF",
    totalAmount: agreement?.totalAmount ?? "",
    agreementDate: agreement?.agreementDate ?? "",
    startDate: agreement?.startDate ?? "",
    endDate: agreement?.endDate ?? "",
    status: agreement?.status ?? "draft",
    notes: agreement?.notes ?? "",
  }));

  function setValue<K extends keyof PaymentAgreementFormValues>(
    key: K,
    value: PaymentAgreementFormValues[K],
  ) {
    setSaved(false);
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function submit() {
    setSaved(false);

    const adding = mode === "add";

    const result = await mutation.mutate<PaymentAgreement>(
      adding
        ? PAYMENT_API_ROUTES.agreementAdd
        : PAYMENT_API_ROUTES.agreementUpdate(agreement!.id),
      {
        method: adding ? "POST" : "PATCH",
        failureMessage: "The payment agreement could not be saved.",
        body: values,
      },
    );

    if (!result) {
      return;
    }

    if (adding) {
      router.replace(`${PAYMENT_ROUTES.edit(result.id)}?created=1`);
      return;
    }

    setSaved(true);
  }

  /**
   * The message for a field the backend rejected, or undefined.
   */
  function fieldError(field: keyof PaymentAgreementFormValues, message: string) {
    return mutation.fields.includes(field) ? message : undefined;
  }

  return {
    values,
    setValue,
    submit,
    fieldError,
    saved,
    pending: mutation.pending,
    error: mutation.error,
  };
}
