"use client";

import {
  Briefcase01Icon,
  File01Icon,
} from "@hugeicons/core-free-icons";
import {
  useRouter,
} from "next/navigation";
import {
  useState,
} from "react";

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
  Input,
} from "@/components/ui/Input/Input";
import {
  Select,
} from "@/components/ui/Select/Select";
import {
  Textarea,
} from "@/components/ui/Textarea/Textarea";
import {
  AGREEMENT_STATUS_OPTIONS,
  AGREEMENT_TYPE_OPTIONS,
  CURRENCY_OPTIONS,
} from "@/constants/payment/payment-options";
import {
  PAYMENT_API_ROUTES,
  PAYMENT_ROUTES,
} from "@/constants/routes/payment-routes";
import {
  usePaymentMutation,
} from "@/hooks/payment/use-payment-mutation";
import type {
  PaymentAgreement,
  PaymentAgreementType,
  PaymentCurrency,
  PaymentAgreementStatus,
} from "@/types/payment";

import styles from "./PaymentAgreementForm.module.css";

interface PortfolioChoice {
  id: number;
  name: string;
}

interface PaymentAgreementFormProps {
  mode:
    | "add"
    | "edit";

  agreement?:
    PaymentAgreement;

  portfolios:
    PortfolioChoice[];
}

export function PaymentAgreementForm({
  mode,
  agreement,
  portfolios,
}: PaymentAgreementFormProps) {
  const router =
    useRouter();

  const mutation =
    usePaymentMutation();

  const [success, setSuccess] =
    useState(false);

  const [values, setValues] =
    useState(() => ({
      portfolioId:
        agreement
          ?.portfolio.id ??
        portfolios[0]?.id ??
        0,

      title:
        agreement?.title ??
        "",

      reference:
        agreement
          ?.reference ??
        "",

      agreementType:
        agreement
          ?.agreementType ??
        "project" as PaymentAgreementType,

      currency:
        agreement
          ?.currency ??
        "RWF" as PaymentCurrency,

      totalAmount:
        agreement
          ?.totalAmount ??
        "",

      agreementDate:
        agreement
          ?.agreementDate ??
        "",

      startDate:
        agreement
          ?.startDate ??
        "",

      endDate:
        agreement
          ?.endDate ??
        "",

      status:
        agreement
          ?.status ??
        "draft" as PaymentAgreementStatus,

      notes:
        agreement?.notes ??
        "",
    }));

  function setValue<
    T extends keyof typeof values,
  >(
    key: T,
    value:
      typeof values[T],
  ) {
    setValues(
      (current) => ({
        ...current,
        [key]: value,
      }),
    );
  }

  async function submit() {
    setSuccess(false);

    const result =
      await mutation.mutate<
        PaymentAgreement
      >(
        mode === "add"
          ? PAYMENT_API_ROUTES
              .agreementAdd
          : PAYMENT_API_ROUTES
              .agreementUpdate(
                agreement!.id,
              ),
        {
          method:
            mode === "add"
              ? "POST"
              : "PATCH",

          failureMessage:
            "The payment agreement could not be saved.",

          body: {
            portfolioId:
              values.portfolioId,

            title:
              values.title,

            reference:
              values.reference,

            agreementType:
              values
                .agreementType,

            currency:
              values.currency,

            totalAmount:
              values.totalAmount,

            agreementDate:
              values
                .agreementDate,

            startDate:
              values.startDate,

            endDate:
              values.endDate,

            status:
              values.status,

            notes:
              values.notes,
          },
        },
      );

    if (!result) {
      return;
    }

    if (
      mode === "add"
    ) {
      router.replace(
        `${PAYMENT_ROUTES.edit(
          result.id,
        )}?created=1`,
      );

      return;
    }

    setSuccess(true);
  }

  function error(
    field: string,
    message: string,
  ) {
    return mutation.fields
      .includes(field)
      ? message
      : undefined;
  }

  return (
    <form
      className={
        styles.form
      }
      onSubmit={(
        event,
      ) => {
        event.preventDefault();

        void submit();
      }}
    >
      {mutation.error && (
        <Alert
          variant="error"
          title="Unable to save agreement"
        >
          {mutation.error}
        </Alert>
      )}

      {success && (
        <Alert
          variant="success"
          title="Agreement saved"
        >
          The payment agreement has been saved.
        </Alert>
      )}

      <section
        className={
          styles.section
        }
      >
        <header
          className={
            styles.sectionHeader
          }
        >
          <span>
            01
          </span>

          <div>
            <h2>
              Agreement
            </h2>

            <p>
              Define which Portfolio this financial agreement belongs to.
            </p>
          </div>
        </header>

        <div
          className={
            styles.grid
          }
        >
          <Select
            label="Portfolio"
            required
            value={
              String(
                values.portfolioId,
              )
            }
            options={
              portfolios.map(
                (portfolio) => ({
                  value:
                    String(
                      portfolio.id,
                    ),

                  label:
                    portfolio.name,
                }),
              )
            }
            error={
              error(
                "portfolioId",
                "Choose a Portfolio.",
              )
            }
            onChange={(
              event,
            ) =>
              setValue(
                "portfolioId",
                Number(
                  event.target
                    .value,
                ),
              )
            }
          />

          <Input
            label="Agreement title"
            required
            value={
              values.title
            }
            placeholder="Website Development Contract"
            leftIcon={
              <Icon
                icon={
                  File01Icon
                }
                size={18}
              />
            }
            error={
              error(
                "title",
                "Enter an agreement title.",
              )
            }
            onChange={(
              event,
            ) =>
              setValue(
                "title",
                event.target
                  .value,
              )
            }
          />

          <Input
            label="Reference"
            value={
              values.reference
            }
            showOptional
            placeholder="NEX-2026-001"
            onChange={(
              event,
            ) =>
              setValue(
                "reference",
                event.target
                  .value,
              )
            }
          />

          <Select
            label="Agreement type"
            value={
              values
                .agreementType
            }
            options={[
              ...AGREEMENT_TYPE_OPTIONS,
            ]}
            error={
              error(
                "agreementType",
                "Choose an agreement type.",
              )
            }
            onChange={(
              event,
            ) =>
              setValue(
                "agreementType",
                event.target
                  .value as
                  PaymentAgreementType,
              )
            }
          />
        </div>
      </section>

      <section
        className={
          styles.section
        }
      >
        <header
          className={
            styles.sectionHeader
          }
        >
          <span>
            02
          </span>

          <div>
            <h2>
              Financial terms
            </h2>

            <p>
              Record the agreed contract value and currency exactly.
            </p>
          </div>
        </header>

        <div
          className={
            styles.grid
          }
        >
          <Select
            label="Currency"
            value={
              values.currency
            }
            options={[
              ...CURRENCY_OPTIONS,
            ]}
            onChange={(
              event,
            ) =>
              setValue(
                "currency",
                event.target
                  .value as
                  PaymentCurrency,
              )
            }
          />

          <Input
            label="Total amount"
            required
            inputMode="decimal"
            value={
              values
                .totalAmount
            }
            placeholder="5000000.00"
            error={
              error(
                "totalAmount",
                "Enter a valid positive amount.",
              )
            }
            onChange={(
              event,
            ) =>
              setValue(
                "totalAmount",
                event.target
                  .value,
              )
            }
          />

          <Select
            label="Status"
            value={
              values.status
            }
            options={[
              ...AGREEMENT_STATUS_OPTIONS,
            ]}
            onChange={(
              event,
            ) =>
              setValue(
                "status",
                event.target
                  .value as
                  PaymentAgreementStatus,
              )
            }
          />
        </div>
      </section>

      <section
        className={
          styles.section
        }
      >
        <header
          className={
            styles.sectionHeader
          }
        >
          <span>
            03
          </span>

          <div>
            <h2>
              Dates
            </h2>

            <p>
              Keep contract signing, start and expiration dates separate.
            </p>
          </div>
        </header>

        <div
          className={
            styles.grid
          }
        >
          <Input
            type="date"
            label="Agreement date"
            required
            value={
              values
                .agreementDate
            }
            onChange={(
              event,
            ) =>
              setValue(
                "agreementDate",
                event.target
                  .value,
              )
            }
          />

          <Input
            type="date"
            label="Start date"
            required
            value={
              values.startDate
            }
            onChange={(
              event,
            ) =>
              setValue(
                "startDate",
                event.target
                  .value,
              )
            }
          />

          <Input
            type="date"
            label="End date"
            value={
              values.endDate
            }
            min={
              values.startDate ||
              undefined
            }
            showOptional={
              values
                .agreementType !==
              "maintenance"
            }
            helperText={
              values
                .agreementType ===
              "maintenance"
                ? "Required for maintenance agreements."
                : undefined
            }
            onChange={(
              event,
            ) =>
              setValue(
                "endDate",
                event.target
                  .value,
              )
            }
          />
        </div>

        <Textarea
          label="Notes"
          rows={6}
          value={
            values.notes
          }
          showOptional
          placeholder="Internal agreement notes"
          onChange={(
            event,
          ) =>
            setValue(
              "notes",
              event.target
                .value,
            )
          }
        />
      </section>

      <footer
        className={
          styles.actions
        }
      >
        <span>
          Monetary values remain stored as exact decimal values.
        </span>

        <div>
          <Button
            href={
              mode === "edit" &&
              agreement
                ? PAYMENT_ROUTES
                    .detail(
                      agreement.id,
                    )
                : PAYMENT_ROUTES
                    .list
            }
            variant="secondary"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            isLoading={
              mutation.pending
            }
            loadingLabel="Saving agreement"
            leftIcon={
              <Icon
                icon={
                  Briefcase01Icon
                }
                size={17}
              />
            }
          >
            {mode === "add"
              ? "Create agreement"
              : "Save changes"}
          </Button>
        </div>
      </footer>
    </form>
  );
}