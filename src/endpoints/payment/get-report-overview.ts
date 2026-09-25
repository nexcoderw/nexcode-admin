import "server-only";

import {
  requestPaymentEndpoint,
} from "@/endpoints/payment/endpoint-helper";
import {
  asRecord,
} from "@/endpoints/payment/mapper-utils";
import {
  mapReportOverview,
} from "@/endpoints/payment/report-mapper";
import type {
  PaymentReportOverview,
  PaymentReportQuery,
} from "@/types/payment/report";
import {
  buildReportBackendSearch,
} from "@/utils/payment/report-query";

export function getPaymentReportOverview(
  sessionId: string,
  forwarded: Headers,
  query:
    PaymentReportQuery = {},
) {
  return requestPaymentEndpoint<
    PaymentReportOverview
  >({
    path:
      "/api/admin/payment/"
      + "report/overview/"
      + buildReportBackendSearch(
        query,
      ),

    sessionId,
    forwarded,

    mapData(value) {
      return mapReportOverview(
        asRecord(value)
          ?.overview,
      );
    },
  });
}