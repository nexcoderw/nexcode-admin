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
  mapPortfolioStatement,
} from "@/endpoints/payment/report-mapper";
import type {
  PaymentPortfolioStatement,
} from "@/types/payment/report";

export function getPortfolioPaymentStatement(
  portfolioId: number,
  sessionId: string,
  forwarded: Headers,
) {
  return requestPaymentEndpoint<
    PaymentPortfolioStatement
  >({
    path:
      `/api/admin/payment/report/statement/${portfolioId}/`,

    sessionId,
    forwarded,

    mapData(value) {
      return mapPortfolioStatement(
        asRecord(value)
          ?.statement,
      );
    },
  });
}

export function getPortfolioPaymentStatementPdf(
  portfolioId: number,
  sessionId: string,
  forwarded: Headers,
) {
  return backendBinaryRequest(
    `/api/admin/payment/report/statement/${portfolioId}/?format=pdf`,
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