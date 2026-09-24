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
  Icon,
} from "@/components/ui/Icon/Icon";
import {
  Input,
} from "@/components/ui/Input/Input";
import {
  PAYMENT_API_ROUTES,
} from "@/constants/routes/payment-routes";
import {
  usePaymentMutation,
} from "@/hooks/payment/use-payment-mutation";
import type {
  PaymentAgreement,
} from "@/types/payment/agreement";

import styles from "./PaymentScheduleBuilder.module.css";

interface PaymentScheduleBuilderProps {
  agreement:
    PaymentAgreement;

  hasSchedule: boolean;
}

export function PaymentScheduleBuilder({
  agreement,
  hasSchedule,
}: PaymentScheduleBuilderProps) {
  const mutation =
    usePaymentMutation();

  const maintenance =
    agreement.agreementType ===
    "maintenance";

  const [downPayment, setDownPayment] =
    useState("");

  const [downDate, setDownDate] =
    useState("");

  const [count, setCount] =
    useState("1");

  const [firstDate, setFirstDate] =
    useState("");

  const [monthlyAmount, setMonthlyAmount] =
    useState("");

  const [months, setMonths] =
    useState("12");

  const [grace, setGrace] =
    useState("0");

  async function submit() {
    await mutation.mutate(
      maintenance
        ? PAYMENT_API_ROUTES
            .maintenanceSchedule(
              agreement.id,
            )
        : PAYMENT_API_ROUTES
            .contractSchedule(
              agreement.id,
            ),
      {
        method: "POST",

        failureMessage:
          "The payment schedule could not be created.",

        body:
          maintenance
            ? {
                monthlyAmount,
                months:
                  Number(
                    months,
                  ),
                firstDueDate:
                  firstDate,
                gracePeriodDays:
                  Number(
                    grace,
                  ),
              }
            : {
                downPaymentAmount:
                  downPayment ||
                  "0.00",

                downPaymentDate:
                  downDate,

                installmentCount:
                  Number(
                    count,
                  ),

                firstInstallmentDate:
                  firstDate,

                gracePeriodDays:
                  Number(
                    grace,
                  ),
              },
      },
    );
  }

  return (
    <section
      className={
        styles.panel
      }
    >
      <header>
        <span>
          Schedule
        </span>

        <h2>
          Generate payment schedule
        </h2>

        <p>
          Create the expected obligations before recording received money.
        </p>
      </header>

      {hasSchedule ? (
        <Alert
          variant="info"
          title="Schedule already created"
        >
          Existing schedules are not silently replaced. Manage individual
          obligations instead of regenerating the agreement.
        </Alert>
      ) : (
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
              title="Unable to create schedule"
            >
              {mutation.error}
            </Alert>
          )}

          {maintenance ? (
            <>
              <Input
                label={`Monthly amount (${agreement.currency})`}
                required
                inputMode="decimal"
                value={
                  monthlyAmount
                }
                onChange={(
                  event,
                ) =>
                  setMonthlyAmount(
                    event.target
                      .value,
                  )
                }
              />

              <Input
                label="Number of months"
                type="number"
                required
                min={1}
                max={120}
                value={months}
                onChange={(
                  event,
                ) =>
                  setMonths(
                    event.target
                      .value,
                  )
                }
              />

              <Input
                label="First payment date"
                type="date"
                required
                value={
                  firstDate
                }
                onChange={(
                  event,
                ) =>
                  setFirstDate(
                    event.target
                      .value,
                  )
                }
              />
            </>
          ) : (
            <>
              <Input
                label={`Down payment (${agreement.currency})`}
                inputMode="decimal"
                value={
                  downPayment
                }
                showOptional
                placeholder="0.00"
                onChange={(
                  event,
                ) =>
                  setDownPayment(
                    event.target
                      .value,
                  )
                }
              />

              <Input
                label="Down payment date"
                type="date"
                value={
                  downDate
                }
                showOptional
                onChange={(
                  event,
                ) =>
                  setDownDate(
                    event.target
                      .value,
                  )
                }
              />

              <Input
                label="Remaining installments"
                type="number"
                min={0}
                value={count}
                onChange={(
                  event,
                ) =>
                  setCount(
                    event.target
                      .value,
                  )
                }
              />

              <Input
                label="First installment date"
                type="date"
                value={
                  firstDate
                }
                onChange={(
                  event,
                ) =>
                  setFirstDate(
                    event.target
                      .value,
                  )
                }
              />
            </>
          )}

          <Input
            label="Grace period days"
            type="number"
            min={0}
            value={grace}
            onChange={(
              event,
            ) =>
              setGrace(
                event.target
                  .value,
              )
            }
          />

          <Button
            type="submit"
            isLoading={
              mutation.pending
            }
            loadingLabel="Creating schedule"
            leftIcon={
              <Icon
                icon={
                  File01Icon
                }
                size={17}
              />
            }
          >
            Generate schedule
          </Button>
        </form>
      )}
    </section>
  );
}