"use client";

import {
  FilterHorizontalIcon,
  FilterIcon,
  FilterResetIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import {
  useState,
} from "react";

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
  AGREEMENT_ORDER_OPTIONS,
  AGREEMENT_STATUS_OPTIONS,
  AGREEMENT_TYPE_OPTIONS,
  CURRENCY_OPTIONS,
} from "@/constants/payment/payment-options";
import {
  PAYMENT_ROUTES,
} from "@/constants/routes/payment-routes";
import type {
  PortfolioSummary,
} from "@/types/portfolio/portfolio";
import type {
  ResolvedPaymentAgreementQuery,
} from "@/utils/payment/payment-page-query";

import styles from "./PaymentFilter.module.css";

interface PaymentFilterProps {
  query:
    ResolvedPaymentAgreementQuery;

  portfolios:
    PortfolioSummary[];
}

export function PaymentFilter({
  query,
  portfolios,
}: PaymentFilterProps) {
  const [open, setOpen] =
    useState(false);

  const activeCount =
    Number(Boolean(query.search)) +
    Number(Boolean(query.portfolioId)) +
    Number(Boolean(query.agreementType)) +
    Number(Boolean(query.status)) +
    Number(Boolean(query.currency)) +
    Number(
      query.ordering !==
        "-created_at",
    );

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        leftIcon={
          <Icon
            icon={
              FilterIcon
            }
            size={18}
          />
        }
        onClick={() =>
          setOpen(true)
        }
      >
        Filters
        {activeCount > 0
          ? ` (${activeCount})`
          : ""}
      </Button>

      <Dialog
        open={open}
        onClose={() =>
          setOpen(false)
        }
        title="Filter payment agreements"
        description="Find agreements by project, status, currency or type."
        size="lg"
      >
        {open && (
          <form
            action={
              PAYMENT_ROUTES.list
            }
            method="get"
            className={
              styles.form
            }
          >
            <Input
              name="search"
              type="search"
              label="Search"
              defaultValue={
                query.search
              }
              placeholder="Agreement, reference or portfolio"
              leftIcon={
                <Icon
                  icon={
                    Search01Icon
                  }
                  size={18}
                />
              }
            />

            <div
              className={
                styles.grid
              }
            >
              <Select
                name="portfolioId"
                label="Portfolio"
                placeholder="All portfolios"
                defaultValue={
                  query.portfolioId
                    ? String(
                        query.portfolioId,
                      )
                    : ""
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
              />

              <Select
                name="agreementType"
                label="Agreement type"
                placeholder="All types"
                defaultValue={
                  query.agreementType ??
                  ""
                }
                options={[
                  ...AGREEMENT_TYPE_OPTIONS,
                ]}
              />

              <Select
                name="status"
                label="Status"
                placeholder="All statuses"
                defaultValue={
                  query.status ??
                  ""
                }
                options={[
                  ...AGREEMENT_STATUS_OPTIONS,
                ]}
              />

              <Select
                name="currency"
                label="Currency"
                placeholder="All currencies"
                defaultValue={
                  query.currency ??
                  ""
                }
                options={[
                  ...CURRENCY_OPTIONS,
                ]}
              />

              <Select
                name="ordering"
                label="Sort by"
                defaultValue={
                  query.ordering
                }
                options={[
                  ...AGREEMENT_ORDER_OPTIONS,
                ]}
                leftIcon={
                  <Icon
                    icon={
                      FilterHorizontalIcon
                    }
                    size={18}
                  />
                }
              />
            </div>

            <div
              className={
                styles.actions
              }
            >
              {activeCount > 0 && (
                <Button
                  href={
                    PAYMENT_ROUTES.list
                  }
                  variant="ghost"
                  leftIcon={
                    <Icon
                      icon={
                        FilterResetIcon
                      }
                      size={17}
                    />
                  }
                >
                  Reset
                </Button>
              )}

              <Button
                type="submit"
                leftIcon={
                  <Icon
                    icon={
                      FilterIcon
                    }
                    size={17}
                  />
                }
              >
                Apply filters
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </>
  );
}