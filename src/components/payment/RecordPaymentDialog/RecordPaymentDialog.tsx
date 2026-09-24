"use client";

import {
  File01Icon,
} from "@hugeicons/core-free-icons";
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
  Dialog,
} from "@/components/ui/Dialog/Dialog";
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
  PAYMENT_METHOD_OPTIONS,
} from "@/constants/payment/payment-options";
import {
  PAYMENT_API_ROUTES,
} from "@/constants/routes/payment-routes";
import {
  usePaymentMutation,
} from "@/hooks/payment/use-payment-mutation";
import type {
  PaymentAgreement,
  PaymentInstallment,
  PaymentMethod,
} from "@/types/payment";

import styles from "./RecordPaymentDialog.module.css";

interface RecordPaymentDialogProps {
  agreement:
    PaymentAgreement;

  installments:
    PaymentInstallment[];
}

export function RecordPaymentDialog({
  agreement,
  installments,
}: RecordPaymentDialogProps) {
  const [open, setOpen] =
    useState(false);

  const [amount, setAmount] =
    useState("");

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState<PaymentMethod>(
    "bank_transfer",
  );

  const [
    reference,
    setReference,
  ] = useState("");

  const [notes, setNotes] =
    useState("");

  const [
    allocations,
    setAllocations,
  ] = useState<
    Record<number, string>
  >({});

  const mutation =
    usePaymentMutation();

  async function submit() {
    const allocationValues =
      Object.entries(
        allocations,
      )
        .filter(
          ([, value]) =>
            value.trim() !== "" &&
            Number(value) > 0,
        )
        .map(
          ([
            installmentId,
            value,
          ]) => ({
            installmentId:
              Number(
                installmentId,
              ),

            amount:
              value,
          }),
        );

    const result =
      await mutation.mutate(
        PAYMENT_API_ROUTES
          .recordAdd(
            agreement.id,
          ),
        {
          method: "POST",

          failureMessage:
            "The payment could not be recorded.",

          body: {
            amount,
            currency:
              agreement.currency,

            paymentMethod,
            reference,
            notes,

            allocations:
              allocationValues,
          },
        },
      );

    if (!result) {
      return;
    }

    setOpen(false);
    setAmount("");
    setReference("");
    setNotes("");
    setAllocations({});
  }

  const available =
    installments.filter(
      (installment) =>
        !installment.isWaived &&
        installment
          .financial
          .paymentState !==
          "paid",
    );

  return (
    <>
      <Button
        type="button"
        leftIcon={
          <Icon
            icon={
              File01Icon
            }
            size={17}
          />
        }
        onClick={() =>
          setOpen(true)
        }
      >
        Record payment
      </Button>

      <Dialog
        open={open}
        onClose={() => {
          if (
            !mutation.pending
          ) {
            setOpen(false);
            mutation.reset();
          }
        }}
        title="Record received payment"
        description="Record the transaction first, then allocate all or part of it to outstanding installments."
        size="lg"
      >
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
              title="Unable to record payment"
            >
              {mutation.error}
            </Alert>
          )}

          <div
            className={
              styles.grid
            }
          >
            <Input
              label={`Amount (${agreement.currency})`}
              required
              inputMode="decimal"
              value={amount}
              placeholder="0.00"
              onChange={(
                event,
              ) =>
                setAmount(
                  event.target
                    .value,
                )
              }
            />

            <Select
              label="Payment method"
              value={
                paymentMethod
              }
              options={[
                ...PAYMENT_METHOD_OPTIONS,
              ]}
              onChange={(
                event,
              ) =>
                setPaymentMethod(
                  event.target
                    .value as
                    PaymentMethod,
                )
              }
            />

            <Input
              label="Reference"
              value={
                reference
              }
              showOptional
              placeholder="Bank or transaction reference"
              onChange={(
                event,
              ) =>
                setReference(
                  event.target
                    .value,
                )
              }
            />
          </div>

          <Textarea
            label="Notes"
            value={notes}
            rows={3}
            showOptional
            onChange={(
              event,
            ) =>
              setNotes(
                event.target
                  .value,
              )
            }
          />

          <section
            className={
              styles.allocations
            }
          >
            <header>
              <h3>
                Allocate payment
              </h3>

              <p>
                Leave an amount blank if this transaction should not be
                allocated to that installment.
              </p>
            </header>

            {available.length ===
            0 ? (
              <p
                className={
                  styles.empty
                }
              >
                No outstanding installments are available. The transaction can
                still be recorded as unallocated.
              </p>
            ) : (
              available.map(
                (
                  installment,
                ) => (
                  <Input
                    key={
                      installment.id
                    }
                    label={
                      installment.title
                    }
                    inputMode="decimal"
                    value={
                      allocations[
                        installment.id
                      ] ?? ""
                    }
                    helperText={`${installment.financial.outstandingAmount} ${agreement.currency} outstanding`}
                    placeholder="0.00"
                    onChange={(
                      event,
                    ) =>
                      setAllocations(
                        (
                          current,
                        ) => ({
                          ...current,
                          [
                            installment.id
                          ]:
                            event
                              .target
                              .value,
                        }),
                      )
                    }
                  />
                ),
              )
            )}
          </section>

          <footer
            className={
              styles.actions
            }
          >
            <Button
              type="button"
              variant="secondary"
              disabled={
                mutation.pending
              }
              onClick={() =>
                setOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              isLoading={
                mutation.pending
              }
              loadingLabel="Recording payment"
              leftIcon={
                <Icon
                  icon={
                    File01Icon
                  }
                  size={17}
                />
              }
            >
              Record payment
            </Button>
          </footer>
        </form>
      </Dialog>
    </>
  );
}