import "server-only";

import {
  requestPaymentEndpoint,
} from "@/endpoints/payment/endpoint-helper";
import {
  asRecord,
} from "@/endpoints/payment/mapper-utils";
import {
  mapCollectionsReport,
} from "@/endpoints/payment/report-mapper";
import type {
  PaymentCollectionsReport,
  PaymentReportQuery,
} from "@/types/payment/report";
import {
  buildReportBackendSearch,
} from "@/utils/payment/report-query";

export function getPaymentCollectionsReport(
  sessionId: string,
  forwarded: Headers,
  query:
    PaymentReportQuery = {},
) {
  return requestPaymentEndpoint<
    PaymentCollectionsReport
  >({
    path:
      "/api/admin/payment/"
      + "report/collections/"
      + buildReportBackendSearch(
        query,
        {
          includeDates: true,
        },
      ),

    sessionId,
    forwarded,

    mapData(value) {
      return mapCollectionsReport(
        asRecord(value)
          ?.report,
      );
    },
  });
}