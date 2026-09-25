import "server-only";

import {
  backendBinaryRequest,
} from "@/endpoints/client";
import {
  requestPaymentEndpoint,
} from "@/endpoints/payment/endpoint-helper";
import {
  asRecord,
} from "@/endpoints/payment/mapper-utils";
import {
  paymentRequestHeaders,
} from "@/endpoints/payment/request-headers";
import {
  mapPaymentReceipt,
} from "@/endpoints/payment/report-mapper";
import type {
  PaymentReceipt,
} from "@/types/payment/report";

export function getPaymentReceipt(
  paymentId: number,
  sessionId: string,
  forwarded: Headers,
) {
  return requestPaymentEndpoint<
    PaymentReceipt
  >({
    path:
      `/api/admin/payment/report/receipt/${paymentId}/`,

    sessionId,
    forwarded,

    mapData(value) {
      return mapPaymentReceipt(
        asRecord(value)
          ?.receipt,
      );
    },
  });
}

export function getPaymentReceiptPdf(
  paymentId: number,
  sessionId: string,
  forwarded: Headers,
) {
  return backendBinaryRequest(
    `/api/admin/payment/report/receipt/${paymentId}/?format=pdf`,
    {
      forwarded,

      headers:
        paymentRequestHeaders(
          sessionId,
        ),

      accept:
        "application/pdf",
    },
  );
}