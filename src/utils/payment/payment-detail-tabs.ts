import { PAYMENT_ROUTES } from "@/constants/routes/payment-routes";

/*
 * The agreement page's sections, in tab order. The active one lives in
 * the URL (?tab=payments), so a tab can be bookmarked, the back button
 * returns to it, and it survives the refresh after a payment is saved.
 */
export const PAYMENT_DETAIL_TABS = [
  { id: "schedule", label: "Schedule" },
  { id: "payments", label: "Payments" },
  { id: "reminders", label: "Reminders" },
  { id: "notifications", label: "Notifications" },
  { id: "settings", label: "Settings" },
] as const;

export type PaymentDetailTab = (typeof PAYMENT_DETAIL_TABS)[number]["id"];

const DEFAULT_TAB: PaymentDetailTab = "schedule";

export function resolvePaymentDetailTab(
  value: string | string[] | undefined,
): PaymentDetailTab {
  const tab = Array.isArray(value) ? value[0] : value;

  return PAYMENT_DETAIL_TABS.some((item) => item.id === tab)
    ? (tab as PaymentDetailTab)
    : DEFAULT_TAB;
}

export function paymentDetailTabHref(
  agreementId: number,
  tab: PaymentDetailTab,
) {
  const base = PAYMENT_ROUTES.detail(agreementId);

  // The default tab keeps the plain URL.
  return tab === DEFAULT_TAB ? base : `${base}?tab=${tab}`;
}
