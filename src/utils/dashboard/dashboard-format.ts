/*
 * Dates arrive as calendar days (YYYY-MM or YYYY-MM-DD); they are read
 * as UTC so a label never shifts by a day in another time zone.
 */

const COMPACT = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const MONTH = new Intl.DateTimeFormat("en", { month: "short", timeZone: "UTC" });

const MONTH_YEAR = new Intl.DateTimeFormat("en", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const DAY_MONTH = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

export function toNumber(amount: string | null) {
  return amount === null ? 0 : Number(amount);
}

/**
 * "1.8M", for axes and tiles where the exact figure is in the tooltip
 * or table.
 */
export function formatCompact(value: number) {
  return COMPACT.format(value);
}

export function formatCompactMoney(amount: string, currency: string) {
  return `${currency} ${formatCompact(toNumber(amount))}`;
}

/** "Sep", from "2026-09". */
export function monthLabel(month: string) {
  return MONTH.format(new Date(`${month}-01T00:00:00Z`));
}

/** "September 2026", from "2026-09". */
export function monthLongLabel(month: string) {
  return MONTH_YEAR.format(new Date(`${month}-01T00:00:00Z`));
}

/** "22 Sep", from "2026-09-22". */
export function dayLabel(day: string) {
  return DAY_MONTH.format(new Date(`${day}T00:00:00Z`));
}

/**
 * "in 3 days", "today", "2 days overdue" and so on.
 */
export function relativeDays(days: number, overdue = false) {
  if (overdue) {
    return days === 0 ? "due today" : `${days} day${days === 1 ? "" : "s"} overdue`;
  }

  if (days === 0) {
    return "today";
  }

  return days === 1 ? "tomorrow" : `in ${days} days`;
}

/**
 * Change against a previous figure, as a signed percentage; null when
 * there is nothing to compare with.
 */
export function percentChange(current: number, previous: number) {
  if (previous === 0) {
    return null;
  }

  return Math.round(((current - previous) / previous) * 100);
}

/**
 * A clean top for a value axis: 1, 2 or 5 times a power of ten.
 */
export function niceMax(value: number) {
  if (value <= 0) {
    return 1;
  }

  const power = 10 ** Math.floor(Math.log10(value));

  for (const step of [1, 2, 5, 10]) {
    if (value <= step * power) {
      return step * power;
    }
  }

  return 10 * power;
}
