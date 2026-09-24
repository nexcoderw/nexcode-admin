import {
  AlarmClockIcon,
  Calendar03Icon,
  Invoice01Icon,
  Notification03Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";

import { Icon } from "@/components/ui/Icon/Icon";
import {
  PAYMENT_DETAIL_TABS,
  type PaymentDetailTab,
  paymentDetailTabHref,
} from "@/utils/payment/payment-detail-tabs";

import styles from "./PaymentDetailTabs.module.css";

const TAB_ICONS: Record<PaymentDetailTab, typeof Calendar03Icon> = {
  schedule: Calendar03Icon,
  payments: Invoice01Icon,
  reminders: AlarmClockIcon,
  notifications: Notification03Icon,
};

interface PaymentDetailTabsProps {
  agreementId: number;
  active: PaymentDetailTab;

  /**
   * A number shown beside a tab; tabs without one show none.
   */
  counts: Partial<Record<PaymentDetailTab, number>>;

  /**
   * Tabs whose count needs attention, such as unread notifications.
   */
  highlight?: PaymentDetailTab[];
}

/**
 * The agreement page's sections as links. Each is a real URL, so this
 * stays a server component and only the chosen section renders.
 */
export function PaymentDetailTabs({
  agreementId,
  active,
  counts,
  highlight = [],
}: PaymentDetailTabsProps) {
  return (
    <nav className={styles.tabs} aria-label="Agreement sections">
      {PAYMENT_DETAIL_TABS.map((tab) => {
        const selected = tab.id === active;
        const count = counts[tab.id];

        return (
          <Link
            key={tab.id}
            href={paymentDetailTabHref(agreementId, tab.id)}
            className={styles.tab}
            aria-current={selected ? "page" : undefined}
            data-selected={selected || undefined}
            // Switching sections keeps the page where it is.
            scroll={false}
          >
            <Icon icon={TAB_ICONS[tab.id]} size={17} />
            <span>{tab.label}</span>

            {count !== undefined && (
              <span
                className={styles.count}
                data-highlight={highlight.includes(tab.id) && count > 0}
              >
                {count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
