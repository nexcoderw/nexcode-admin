import type {
  CashflowMonth,
  CountSlice,
  MessageWeek,
} from "@/types/dashboard/dashboard";
import { dayLabel, monthLongLabel } from "@/utils/dashboard/dashboard-format";
import { formatPaymentMoney } from "@/utils/payment/payment-format";

/*
 * Each chart's data as a plain table, so every value can be read
 * without hovering, by keyboard or by screen reader.
 */

export function CashflowTable({
  months,
  currency,
}: {
  months: CashflowMonth[];
  currency: string;
}) {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Month</th>
          <th scope="col">Expected</th>
          <th scope="col">Collected</th>
        </tr>
      </thead>
      <tbody>
        {months.map((month) => (
          <tr key={month.month}>
            <td>{monthLongLabel(month.month)}</td>
            <td>{formatPaymentMoney(month.expected, currency)}</td>
            <td>
              {month.collected === null
                ? "Not yet due"
                : formatPaymentMoney(month.collected, currency)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function WeeksTable({ weeks }: { weeks: MessageWeek[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Week of</th>
          <th scope="col">Messages</th>
        </tr>
      </thead>
      <tbody>
        {weeks.map((week) => (
          <tr key={week.week}>
            <td>{dayLabel(week.week)}</td>
            <td>{week.count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function SlicesTable({ slices, heading }: { slices: CountSlice[]; heading: string }) {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">{heading}</th>
          <th scope="col">Count</th>
        </tr>
      </thead>
      <tbody>
        {slices.map((slice) => (
          <tr key={slice.key}>
            <td>{slice.label}</td>
            <td>{slice.count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
