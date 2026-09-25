import type {
  NextRequest,
} from "next/server";

import {
  getPaymentCollectionsReport,
} from "@/endpoints/payment/get-collections-report";
import {
  getPaymentOutstandingReport,
} from "@/endpoints/payment/get-outstanding-report";
import type {
  PaymentEndpointResult,
} from "@/endpoints/payment/types";
import type {
  PaymentCollectionsReport,
  PaymentOutstandingReport,
} from "@/types/payment/report";
import {
  getPaymentRequestSession,
} from "@/utils/payment/payment-session";
import {
  collectionsReportCsv,
  outstandingReportCsv,
} from "@/utils/payment/report-csv";
import {
  parsePaymentReportSearchParams,
} from "@/utils/payment/report-query";
import {
  paymentAuthenticationRequired,
  paymentInvalidRequest,
  paymentServiceUnavailable,
} from "@/utils/payment/payment-responses";

export async function GET(
  request: NextRequest,
) {
  const type =
    request.nextUrl.searchParams.get(
      "type",
    );

  if (
    type !== "collections" &&
    type !== "outstanding"
  ) {
    return paymentInvalidRequest();
  }

  const query =
    parsePaymentReportSearchParams(
      request.nextUrl.searchParams,
    );

  if (!query) {
    return paymentInvalidRequest();
  }

  const session =
    getPaymentRequestSession(
      request,
    );

  if (!session) {
    return (
      paymentAuthenticationRequired()
    );
  }

  const forwarded =
    new Headers(
      request.headers,
    );

  try {
    if (type === "collections") {
      const result =
        await getPaymentCollectionsReport(
          session.sessionId,
          forwarded,
          query,
        );

      return collectionsResponse(
        result,
      );
    }

    const result =
      await getPaymentOutstandingReport(
        session.sessionId,
        forwarded,
        query,
      );

    return outstandingResponse(
      result,
    );
  } catch {
    return paymentServiceUnavailable();
  }
}

function collectionsResponse(
  result:
    PaymentEndpointResult<
      PaymentCollectionsReport
    >,
) {
  const error =
    reportErrorResponse(
      result,
    );

  if (error) {
    return error;
  }

  const csv =
    collectionsReportCsv(
      result.data!,
    );

  return csvResponse(
    csv,
    "payment-collections-report.csv",
  );
}

function outstandingResponse(
  result:
    PaymentEndpointResult<
      PaymentOutstandingReport
    >,
) {
  const error =
    reportErrorResponse(
      result,
    );

  if (error) {
    return error;
  }

  const csv =
    outstandingReportCsv(
      result.data!,
    );

  return csvResponse(
    csv,
    "payment-outstanding-report.csv",
  );
}

function reportErrorResponse(
  result:
    PaymentEndpointResult<
      unknown
    >,
) {
  if (
    result.status === 401 ||
    result.status === 403
  ) {
    return (
      paymentAuthenticationRequired()
    );
  }

  if (
    result.status === 400
  ) {
    return paymentInvalidRequest();
  }

  if (
    !result.ok ||
    !result.data
  ) {
    return paymentServiceUnavailable();
  }

  return null;
}

function csvResponse(
  csv: string,
  filename: string,
) {
  return new Response(
    `\uFEFF${csv}`,
    {
      status: 200,

      headers: {
        "Content-Type":
          "text/csv; charset=utf-8",

        "Content-Disposition":
          `attachment; filename="${filename}"`,

        "Cache-Control":
          "no-store",

        "X-Content-Type-Options":
          "nosniff",
      },
    },
  );
}