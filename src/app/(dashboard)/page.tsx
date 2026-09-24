import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AttentionPanel } from "@/components/dashboard/AttentionPanel/AttentionPanel";
import { RankedBars, StackedShare } from "@/components/dashboard/BreakdownCharts/BreakdownCharts";
import { CashflowChart } from "@/components/dashboard/CashflowChart/CashflowChart";
import { ChartFrame } from "@/components/dashboard/ChartFrame/ChartFrame";
import { DashboardFigures } from "@/components/dashboard/DashboardFigures/DashboardFigures";
import {
  CashflowTable,
  SlicesTable,
  WeeksTable,
} from "@/components/dashboard/DashboardTables/DashboardTables";
import { MessagesTrend } from "@/components/dashboard/MessagesTrend/MessagesTrend";
import { RecentPayments } from "@/components/dashboard/RecentPayments/RecentPayments";
import { Alert } from "@/components/ui/Alert/Alert";
import { PAYMENT_CURRENCIES } from "@/constants/payment/payment-query";
import { ADMIN_ROUTES } from "@/constants/routes/admin-routes";
import { AUTH_ROUTES } from "@/constants/routes/auth-routes";
import { ERROR_ROUTES } from "@/constants/routes/error-routes";
import { getDashboardOverview } from "@/endpoints/dashboard/get-overview";
import type { PaymentCurrency } from "@/types/payment/shared";
import { getPaymentServerContext } from "@/utils/payment/payment-server-data";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Dashboard",
};

interface DashboardPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const TODAY = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const context = await getPaymentServerContext();

  if (!context) {
    redirect(AUTH_ROUTES.login);
  }

  const requested = (await searchParams).currency;
  const currency = PAYMENT_CURRENCIES.find((item) => item === requested) as
    | PaymentCurrency
    | undefined;

  const result = await getDashboardOverview(
    context.sessionId,
    context.forwarded,
    currency,
  );

  if (result.status === 401) {
    redirect(ERROR_ROUTES.unauthorized);
  }

  if (result.status === 403) {
    redirect(ERROR_ROUTES.forbidden);
  }

  const data = result.ok ? result.data : null;

  if (!data) {
    return (
      <Alert variant="error" title="Dashboard unavailable">
        The dashboard figures could not be loaded. Please try again shortly.
      </Alert>
    );
  }

  const currentMonth = data.today.slice(0, 7);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>
            {TODAY.format(new Date(`${data.today}T00:00:00Z`))}
          </span>
          <h1>Overview</h1>
        </div>

        {/* Money is reported in one currency at a time. */}
        {data.currencies.length > 1 && (
          <nav className={styles.currencies} aria-label="Reporting currency">
            {data.currencies.map((item) => (
              <Link
                key={item}
                href={`${ADMIN_ROUTES.dashboard}?currency=${item}`}
                aria-current={item === data.currency ? "page" : undefined}
              >
                {item}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <AttentionPanel alerts={data.alerts} />

      <DashboardFigures data={data} currentMonth={currentMonth} />

      <div className={styles.charts}>
        <ChartFrame
          title="Collected against expected"
          description={`Monthly, in ${data.currency}. Grey is what fell due; lime is what came in.`}
          legend={[
            { label: "Collected", color: "var(--chart-accent)", kind: "bar" },
            { label: "Expected", color: "var(--chart-context)", kind: "bar" },
          ]}
          table={<CashflowTable months={data.cashflow} currency={data.currency} />}
        >
          <CashflowChart
            months={data.cashflow}
            currency={data.currency}
            currentMonth={currentMonth}
          />
        </ChartFrame>

        <ChartFrame
          title="Website messages"
          description="Per week, over the last 12 weeks."
          table={<WeeksTable weeks={data.messagesByWeek} />}
        >
          <MessagesTrend weeks={data.messagesByWeek} />
        </ChartFrame>
      </div>

      <div className={styles.breakdowns}>
        <ChartFrame
          title="Agreements by status"
          description={`${data.counts.agreements} agreements in total.`}
          table={<SlicesTable slices={data.agreementsByStatus} heading="Status" />}
        >
          <StackedShare slices={data.agreementsByStatus} />
        </ChartFrame>

        <ChartFrame
          title="Portfolio by category"
          description={`${data.counts.publishedPortfolios} of ${data.counts.portfolios} published.`}
          table={<SlicesTable slices={data.portfoliosByCategory} heading="Category" />}
        >
          <RankedBars slices={data.portfoliosByCategory} />
        </ChartFrame>

        <section className={styles.recent} aria-labelledby="recent-payments-title">
          <h2 id="recent-payments-title">Recent payments</h2>
          <RecentPayments payments={data.recentPayments} currency={data.currency} />
        </section>
      </div>
    </div>
  );
}
