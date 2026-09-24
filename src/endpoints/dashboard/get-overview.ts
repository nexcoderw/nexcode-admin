import "server-only";

import { mapDashboardOverview } from "@/endpoints/dashboard/mapper";
// The payment helper is a general authenticated GET-and-map; the
// dashboard reads through it rather than duplicating it.
import { requestPaymentEndpoint } from "@/endpoints/payment/endpoint-helper";
import type { DashboardOverview } from "@/types/dashboard/dashboard";
import type { PaymentCurrency } from "@/types/payment/shared";

export function getDashboardOverview(
  sessionId: string,
  forwarded: Headers,
  currency?: PaymentCurrency,
) {
  const suffix = currency ? `?currency=${currency}` : "";

  return requestPaymentEndpoint<DashboardOverview>({
    path: `/api/admin/dashboard/overview/${suffix}`,
    sessionId,
    forwarded,
    mapData: mapDashboardOverview,
  });
}
