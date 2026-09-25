"use client";

import { FilterIcon, FilterResetIcon } from "@hugeicons/core-free-icons";
import { useState } from "react";

import { Button } from "@/components/ui/Button/Button";
import { Dialog } from "@/components/ui/Dialog/Dialog";
import { Icon } from "@/components/ui/Icon/Icon";
import { Input } from "@/components/ui/Input/Input";
import { Select } from "@/components/ui/Select/Select";
import { CURRENCY_OPTIONS } from "@/constants/payment/payment-options";
import { PAYMENT_ROUTES } from "@/constants/routes/payment-routes";
import type { PortfolioSummary } from "@/types/portfolio/portfolio";
import type { ResolvedPaymentReportQuery } from "@/utils/payment/report-query";

import styles from "./PaymentReportFilter.module.css";

interface PaymentReportFilterProps {
  query: ResolvedPaymentReportQuery;

  portfolios: PortfolioSummary[];
}

const OUTSTANDING_OPTIONS = [
  {
    value: "all",
    label: "All outstanding",
  },
  {
    value: "overdue",
    label: "Overdue only",
  },
  {
    value: "due_soon",
    label: "Due soon only",
  },
];

export function PaymentReportFilter({
  query,
  portfolios,
}: PaymentReportFilterProps) {
  const [open, setOpen] = useState(false);

  const active =
    Number(Boolean(query.portfolioId)) +
    Number(Boolean(query.currency)) +
    Number(Boolean(query.dateFrom)) +
    Number(Boolean(query.dateTo)) +
    Number(query.dueWithinDays !== 30) +
    Number(query.outstandingKind !== "all");

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        leftIcon={<Icon icon={FilterIcon} size={17} />}
        onClick={() => setOpen(true)}
      >
        Report filters
        {active > 0 ? ` (${active})` : ""}
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Filter payment reports"
        description="Narrow collections and outstanding obligations without combining currencies."
        size="lg"
      >
        <form
          action={PAYMENT_ROUTES.reports}
          method="get"
          className={styles.form}
        >
          <input type="hidden" name="tab" value={query.tab} />
          <div className={styles.grid}>
            <Select
              name="portfolioId"
              label="Portfolio"
              placeholder="All Portfolios"
              defaultValue={query.portfolioId ? String(query.portfolioId) : ""}
              options={portfolios.map((portfolio) => ({
                value: String(portfolio.id),

                label: portfolio.name,
              }))}
            />

            <Select
              name="currency"
              label="Currency"
              placeholder="All currencies"
              defaultValue={query.currency ?? ""}
              options={[...CURRENCY_OPTIONS]}
            />

            <Input
              type="date"
              name="dateFrom"
              label="Collections from"
              defaultValue={query.dateFrom}
              showOptional
            />

            <Input
              type="date"
              name="dateTo"
              label="Collections to"
              defaultValue={query.dateTo}
              min={query.dateFrom}
              showOptional
            />

            <Input
              type="number"
              name="dueWithinDays"
              label="Due-soon window"
              min={1}
              max={365}
              defaultValue={query.dueWithinDays}
              helperText="Number of days used for due-soon reporting."
            />

            <Select
              name="outstandingKind"
              label="Outstanding view"
              defaultValue={query.outstandingKind}
              options={OUTSTANDING_OPTIONS}
            />
          </div>

          <div className={styles.actions}>
            {active > 0 && (
              <Button
                href={PAYMENT_ROUTES.reports}
                variant="ghost"
                leftIcon={<Icon icon={FilterResetIcon} size={17} />}
              >
                Reset
              </Button>
            )}

            <Button
              type="submit"
              leftIcon={<Icon icon={FilterIcon} size={17} />}
            >
              Apply filters
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
