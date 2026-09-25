import {
  ArrowLeft01Icon,
  Calendar03Icon,
  File01Icon,
  Invoice01Icon,
} from "@hugeicons/core-free-icons";
import type {
  Metadata,
} from "next";
import Link from "next/link";
import {
  redirect,
} from "next/navigation";

import {
  PaymentCollectionsTable,
} from "@/components/payment/PaymentCollectionsTable/PaymentCollectionsTable";
import {
  PaymentOutstandingTable,
} from "@/components/payment/PaymentOutstandingTable/PaymentOutstandingTable";
import {
  PaymentReportFilter,
} from "@/components/payment/PaymentReportFilter/PaymentReportFilter";
import {
  PaymentReportingDashboard,
} from "@/components/payment/PaymentReportingDashboard/PaymentReportingDashboard";
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
  getPaymentCollectionsReport,
} from "@/endpoints/payment/get-collections-report";
import {
  getPaymentOutstandingReport,
} from "@/endpoints/payment/get-outstanding-report";
import {
  getPaymentReportOverview,
} from "@/endpoints/payment/get-report-overview";
import type {
  PaymentReportTab,
  ResolvedPaymentReportQuery,
} from "@/utils/payment/report-query";
import {
  buildPaymentReportTabHref,
  resolvePaymentReportQuery,
  toPaymentReportEndpointQuery,
} from "@/utils/payment/report-query";
import type {
  PaymentServerContext,
} from "@/utils/payment/payment-server-data";
import {
  getPaymentServerContext,
  listPaymentPortfolios,
} from "@/utils/payment/payment-server-data";
import {
  formatPaymentDate,
} from "@/utils/payment/payment-format";

import styles from "./page.module.css";

export const metadata:
  Metadata = {
    title:
      "Payment Reports",
  };

interface PaymentReportsPageProps {
  searchParams:
    Promise<
      Record<
        string,
        string |
        string[] |
        undefined
      >
    >;
}

const REPORT_TABS = [
  {
    id:
      "collections",
    label:
      "Collections",
    icon:
      Invoice01Icon,
  },
  {
    id:
      "outstanding",
    label:
      "Outstanding",
    icon:
      Calendar03Icon,
  },
] as const;

export default async function PaymentReportsPage({
  searchParams,
}: PaymentReportsPageProps) {
  const context =
    await getPaymentServerContext();

  if (!context) {
    redirect(
      AUTH_ROUTES.login,
    );
  }

  const query =
    resolvePaymentReportQuery(
      await searchParams,
    );

  const endpointQuery =
    toPaymentReportEndpointQuery(
      query,
    );

  const [
    overview,
    portfolios,
    selectedReport,
  ] = await Promise.all([
    getPaymentReportOverview(
      context.sessionId,
      context.forwarded,
      endpointQuery,
    ),

    listPaymentPortfolios(
      context,
    ),

    loadSelectedReport(
      query.tab,
      context,
      query,
    ),
  ]);

  const statuses = [
    overview.status,
    selectedReport.result.status,
  ];

  if (
    statuses.includes(401)
  ) {
    redirect(
      ERROR_ROUTES.unauthorized,
    );
  }

  if (
    statuses.includes(403)
  ) {
    redirect(
      ERROR_ROUTES.forbidden,
    );
  }

  const portfolioItems =
    portfolios.ok
      ? portfolios.items
      : [];

  const selectedPortfolio =
    query.portfolioId
      ? portfolioItems.find(
          (portfolio) =>
            portfolio.id ===
            query.portfolioId,
        )
      : undefined;

  return (
    <div
      className={
        styles.page
      }
    >
      <nav
        className={
          styles.actions
        }
        aria-label="Payment report actions"
      >
        <Button
          href={
            PAYMENT_ROUTES.list
          }
          variant="ghost"
          size="sm"
          leftIcon={
            <Icon
              icon={
                ArrowLeft01Icon
              }
              size={16}
            />
          }
        >
          Payments
        </Button>

        <div
          className={
            styles.primaryActions
          }
        >
          {query.portfolioId && (
            <Button
              href={
                PAYMENT_ROUTES.statement(
                  query.portfolioId,
                )
              }
              variant="secondary"
              size="sm"
              leftIcon={
                <Icon
                  icon={
                    File01Icon
                  }
                  size={16}
                />
              }
            >
              Portfolio statement
            </Button>
          )}

          <PaymentReportFilter
            query={query}
            portfolios={
              portfolioItems
            }
          />
        </div>
      </nav>

      <section
        className={
          styles.reportHeader
        }
      >
        <div
          className={
            styles.title
          }
        >
          <span>
            Financial reporting
          </span>

          <h1>
            Payment reports
          </h1>

          <p>
            Collections, receivables and payment position based on the
            financial ledger.
          </p>
        </div>

        <dl
          className={
            styles.facts
          }
        >
          <div>
            <dt>
              Scope
            </dt>

            <dd>
              {selectedPortfolio
                ?.name ??
                (
                  query.portfolioId
                    ? `Portfolio #${query.portfolioId}`
                    : "All Portfolios"
                )}
            </dd>
          </div>

          <div>
            <dt>
              Currency
            </dt>

            <dd>
              {query.currency ??
                "All currencies"}
            </dd>
          </div>

          <div>
            <dt>
              Collections
            </dt>

            <dd>
              {reportPeriod(
                query,
              )}
            </dd>
          </div>

          <div>
            <dt>
              Due soon
            </dt>

            <dd>
              {
                query.dueWithinDays
              }{" "}
              days
            </dd>
          </div>
        </dl>
      </section>

      {!overview.ok ||
      !overview.data ? (
        <Alert
          variant="error"
          title="Financial overview unavailable"
        >
          The financial position could not be loaded.
        </Alert>
      ) : (
        <PaymentReportingDashboard
          overview={
            overview.data
          }
        />
      )}

      <nav
        className={
          styles.tabs
        }
        aria-label="Payment report sections"
      >
        {REPORT_TABS.map(
          (tab) => {
            const selected =
              query.tab ===
              tab.id;

            return (
              <Link
                key={
                  tab.id
                }
                href={
                  buildPaymentReportTabHref(
                    query,
                    tab.id,
                  )
                }
                className={
                  styles.tab
                }
                aria-current={
                  selected
                    ? "page"
                    : undefined
                }
                data-selected={
                  selected ||
                  undefined
                }
                scroll={false}
              >
                <Icon
                  icon={
                    tab.icon
                  }
                  size={17}
                />

                <span>
                  {tab.label}
                </span>
              </Link>
            );
          },
        )}
      </nav>

      <section
        className={
          styles.panel
        }
      >
        {renderSelectedReport(
          selectedReport,
          query,
        )}
      </section>
    </div>
  );
}

async function loadSelectedReport(
  tab: PaymentReportTab,
  context:
    PaymentServerContext,
  query:
    ResolvedPaymentReportQuery,
) {
  const endpointQuery =
    toPaymentReportEndpointQuery(
      query,
    );

  if (
    tab ===
    "outstanding"
  ) {
    return {
      tab:
        "outstanding" as const,

      result:
        await getPaymentOutstandingReport(
          context.sessionId,
          context.forwarded,
          endpointQuery,
        ),
    };
  }

  return {
    tab:
      "collections" as const,

    result:
      await getPaymentCollectionsReport(
        context.sessionId,
        context.forwarded,
        endpointQuery,
      ),
  };
}

function renderSelectedReport(
  selected:
    Awaited<
      ReturnType<
        typeof loadSelectedReport
      >
    >,

  query:
    ResolvedPaymentReportQuery,
) {
  if (
    !selected.result.ok ||
    !selected.result.data
  ) {
    return (
      <Alert
        variant="error"
        title="Report unavailable"
      >
        The selected payment report could not be loaded.
      </Alert>
    );
  }

  if (
    selected.tab ===
    "outstanding"
  ) {
    return (
      <PaymentOutstandingTable
        report={
          selected.result.data
        }
        query={query}
      />
    );
  }

  return (
    <PaymentCollectionsTable
      report={
        selected.result.data
      }
      query={query}
    />
  );
}

function reportPeriod(
  query:
    ResolvedPaymentReportQuery,
) {
  if (
    query.dateFrom &&
    query.dateTo
  ) {
    return (
      `${formatPaymentDate(
        query.dateFrom,
      )} – ${formatPaymentDate(
        query.dateTo,
      )}`
    );
  }

  if (query.dateFrom) {
    return (
      `From ${formatPaymentDate(
        query.dateFrom,
      )}`
    );
  }

  if (query.dateTo) {
    return (
      `Until ${formatPaymentDate(
        query.dateTo,
      )}`
    );
  }

  return "All recorded payments";
}