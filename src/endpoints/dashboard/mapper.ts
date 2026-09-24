import "server-only";

import { PAYMENT_CURRENCIES } from "@/constants/payment/payment-query";
import {
  asRecord,
  isBoolean,
  isMoney,
  isNumber,
  isOneOf,
  isString,
  type UnknownRecord,
} from "@/endpoints/payment/mapper-utils";
import type {
  CashflowMonth,
  CountSlice,
  DashboardOverview,
  EndingAlert,
  InstallmentAlert,
  MessageWeek,
  RecentPayment,
} from "@/types/dashboard/dashboard";

/**
 * Validate the backend's dashboard payload. Any malformed value rejects
 * the whole overview, so the page never shows a wrong figure.
 */
export function mapDashboardOverview(value: unknown): DashboardOverview | null {
  const data = asRecord(value);
  const money = asRecord(data?.money);
  const counts = asRecord(data?.counts);
  const alerts = asRecord(data?.alerts);

  if (
    !data ||
    !money ||
    !counts ||
    !alerts ||
    !isOneOf(data.currency, PAYMENT_CURRENCIES) ||
    !isString(data.today) ||
    !Array.isArray(data.currencies) ||
    !data.currencies.every((item) => isOneOf(item, PAYMENT_CURRENCIES)) ||
    !allMoney(money, [
      "collected_this_month",
      "collected_last_month",
      "collected_this_year",
      "outstanding",
      "overdue",
      "expected_next_30_days",
    ]) ||
    !isNumber(money.overdue_count) ||
    !allNumbers(counts, [
      "active_agreements",
      "agreements",
      "unanswered_messages",
      "messages_this_month",
      "clients",
      "published_portfolios",
      "portfolios",
      "team_members",
    ])
  ) {
    return null;
  }

  const cashflow = mapList(data.cashflow, mapCashflowMonth);
  const messagesByWeek = mapList(data.messages_by_week, mapMessageWeek);
  const byStatus = mapList(data.agreements_by_status, (item) => mapSlice(item, "status"));
  const byCategory = mapList(data.portfolios_by_category, (item) => mapSlice(item, "category"));
  const dueSoon = mapList(alerts.due_soon, mapInstallmentAlert);
  const overdue = mapList(alerts.overdue, mapInstallmentAlert);
  const endingSoon = mapList(alerts.ending_soon, mapEndingAlert);
  const recentPayments = mapList(data.recent_payments, mapRecentPayment);

  if (
    !cashflow ||
    !messagesByWeek ||
    !byStatus ||
    !byCategory ||
    !dueSoon ||
    !overdue ||
    !endingSoon ||
    !recentPayments
  ) {
    return null;
  }

  return {
    currency: data.currency,
    currencies: data.currencies as DashboardOverview["currencies"],
    today: data.today,
    money: {
      collectedThisMonth: money.collected_this_month as string,
      collectedLastMonth: money.collected_last_month as string,
      collectedThisYear: money.collected_this_year as string,
      outstanding: money.outstanding as string,
      overdue: money.overdue as string,
      overdueCount: money.overdue_count,
      expectedNext30Days: money.expected_next_30_days as string,
    },
    counts: {
      activeAgreements: counts.active_agreements as number,
      agreements: counts.agreements as number,
      unansweredMessages: counts.unanswered_messages as number,
      messagesThisMonth: counts.messages_this_month as number,
      clients: counts.clients as number,
      publishedPortfolios: counts.published_portfolios as number,
      portfolios: counts.portfolios as number,
      teamMembers: counts.team_members as number,
    },
    cashflow,
    messagesByWeek,
    agreementsByStatus: byStatus,
    portfoliosByCategory: byCategory,
    alerts: { dueSoon, overdue, endingSoon },
    recentPayments,
  };
}

function mapCashflowMonth(value: unknown): CashflowMonth | null {
  const item = asRecord(value);
  return item &&
    isString(item.month) &&
    isMoney(item.expected) &&
    (item.collected === null || isMoney(item.collected))
    ? { month: item.month, expected: item.expected, collected: item.collected }
    : null;
}

function mapMessageWeek(value: unknown): MessageWeek | null {
  const item = asRecord(value);
  return item && isString(item.week) && isNumber(item.count)
    ? { week: item.week, count: item.count }
    : null;
}

function mapSlice(value: unknown, keyField: string): CountSlice | null {
  const item = asRecord(value);
  const key = item?.[keyField];
  return item && isString(key) && isString(item.label) && isNumber(item.count)
    ? { key, label: item.label, count: item.count }
    : null;
}

function mapInstallmentAlert(value: unknown): InstallmentAlert | null {
  const item = asRecord(value);
  return item &&
    isNumber(item.installment_id) &&
    isNumber(item.agreement_id) &&
    isString(item.agreement_title) &&
    isString(item.portfolio_name) &&
    isString(item.title) &&
    isString(item.due_date) &&
    isNumber(item.days) &&
    isMoney(item.outstanding) &&
    isOneOf(item.currency, PAYMENT_CURRENCIES) &&
    isBoolean(item.in_grace)
    ? {
        installmentId: item.installment_id,
        agreementId: item.agreement_id,
        agreementTitle: item.agreement_title,
        portfolioName: item.portfolio_name,
        title: item.title,
        dueDate: item.due_date,
        days: item.days,
        outstanding: item.outstanding,
        currency: item.currency,
        inGrace: item.in_grace,
      }
    : null;
}

function mapEndingAlert(value: unknown): EndingAlert | null {
  const item = asRecord(value);
  return item &&
    isNumber(item.agreement_id) &&
    isString(item.agreement_title) &&
    isString(item.portfolio_name) &&
    isString(item.end_date) &&
    isNumber(item.days)
    ? {
        agreementId: item.agreement_id,
        agreementTitle: item.agreement_title,
        portfolioName: item.portfolio_name,
        endDate: item.end_date,
        days: item.days,
      }
    : null;
}

function mapRecentPayment(value: unknown): RecentPayment | null {
  const item = asRecord(value);
  return item &&
    isNumber(item.id) &&
    isNumber(item.agreement_id) &&
    isString(item.agreement_title) &&
    isString(item.portfolio_name) &&
    isMoney(item.amount) &&
    isString(item.paid_at) &&
    isString(item.payment_method)
    ? {
        id: item.id,
        agreementId: item.agreement_id,
        agreementTitle: item.agreement_title,
        portfolioName: item.portfolio_name,
        amount: item.amount,
        paidAt: item.paid_at,
        paymentMethod: item.payment_method,
      }
    : null;
}

function mapList<T>(value: unknown, mapper: (item: unknown) => T | null): T[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const items: T[] = [];
  for (const raw of value) {
    const item = mapper(raw);
    if (!item) {
      return null;
    }
    items.push(item);
  }
  return items;
}

function allMoney(record: UnknownRecord, keys: string[]) {
  return keys.every((key) => isMoney(record[key]));
}

function allNumbers(record: UnknownRecord, keys: string[]) {
  return keys.every((key) => isNumber(record[key]));
}
