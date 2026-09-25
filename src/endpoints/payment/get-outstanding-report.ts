import "server-only";

import {
  requestPaymentEndpoint,
} from "@/endpoints/payment/endpoint-helper";
import {
  asRecord,
} from "@/endpoints/payment/mapper-utils";
import {
  mapOutstandingReport,
} from "@/endpoints/payment/report-mapper";
import type {
  PaymentOutstandingReport,
  PaymentReportQuery,
} from "@/types/payment/report";
import {
  buildReportBackendSearch,
} from "@/utils/payment/report-query";

export function getPaymentOutstandingReport(
  sessionId: string,
  forwarded: Headers,
  query:
    PaymentReportQuery = {},
) {
  return requestPaymentEndpoint<
    PaymentOutstandingReport
  >({
    path:
      "/api/admin/payment/"
      + "report/outstanding/"
      + buildReportBackendSearch(
        query,
        {
          includeKind: true,
        },
      ),

    sessionId,
    forwarded,

    mapData(value) {
      return mapOutstandingReport(
        asRecord(value)
          ?.report,
      );
    },
  });
}