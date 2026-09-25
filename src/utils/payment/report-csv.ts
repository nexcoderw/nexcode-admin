import type {
    PaymentCollectionsReport,
    PaymentOutstandingReport,
} from "@/types/payment/report";

export function collectionsReportCsv(
    report:
        PaymentCollectionsReport,
) {
    const rows = [
        [
            "Month",
            "Currency",
            "Received",
            "Payment count",
        ],

        ...report.rows.map(
            (row) => [
                row.month,
                row.currency,
                row.amount,
                String(
                    row.paymentCount,
                ),
            ],
        ),
    ];

    return toCsv(rows);
}

export function outstandingReportCsv(
    report:
        PaymentOutstandingReport,
) {
    const rows = [
        [
            "Portfolio",
            "Agreement",
            "Installment",
            "Currency",
            "Expected amount",
            "Paid amount",
            "Outstanding",
            "Due date",
            "Payment state",
            "Timing state",
        ],

        ...report.rows.map(
            (row) => [
                row.portfolio.name,
                row.agreementTitle,
                row.title,
                row.currency,
                row.amount,
                row.paidAmount,
                row.outstandingAmount,
                row.effectiveDueDate ??
                "",
                row.paymentState,
                row.timingState,
            ],
        ),
    ];

    return toCsv(rows);
}

function toCsv(
    rows: string[][],
) {
    return rows
        .map(
            (row) =>
                row
                    .map(
                        escapeCell,
                    )
                    .join(","),
        )
        .join("\r\n");
}

function escapeCell(
    value: string,
) {
    if (
        /[",\r\n]/.test(
            value
        )
    ) {
        return (
            `"${value.replaceAll(
                '"',
                '""',
            )}"`
        );
    }

    return value;
}