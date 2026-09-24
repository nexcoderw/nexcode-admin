import { Notification03Icon } from "@hugeicons/core-free-icons";

import { PaymentReminderRuleForm } from "@/components/payment/PaymentReminderRuleForm/PaymentReminderRuleForm";
import { PaymentReminderRuleRow } from "@/components/payment/PaymentReminderRuleRow/PaymentReminderRuleRow";
import { Badge } from "@/components/ui/Badge/Badge";
import { Icon } from "@/components/ui/Icon/Icon";
import type { PaymentReminderRule } from "@/types/payment/reminder";

import styles from "./PaymentReminderPanel.module.css";

interface PaymentReminderPanelProps {
  agreementId: number;
  rules: PaymentReminderRule[];
}

/**
 * The agreement's reminders: a form to add one, then the list. Only the
 * form and each row are interactive, so the panel itself stays a server
 * component.
 */
export function PaymentReminderPanel({
  agreementId,
  rules,
}: PaymentReminderPanelProps) {
  const enabledCount = rules.filter((rule) => rule.isEnabled).length;

  return (
    <section className={styles.panel} aria-labelledby="reminder-rules-title">
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Automation</span>
          <h2 id="reminder-rules-title">Reminders</h2>
        </div>

        <Badge size="sm" variant={enabledCount > 0 ? "primary" : "neutral"}>
          {enabledCount} of {rules.length} active
        </Badge>
      </header>

      <PaymentReminderRuleForm agreementId={agreementId} />

      {rules.length === 0 ? (
        <div className={styles.empty}>
          <Icon icon={Notification03Icon} size={22} />
          <p>
            No reminders yet. Add one before a due date, or on a date you
            choose.
          </p>
        </div>
      ) : (
        <ul className={styles.rules}>
          {rules.map((rule) => (
            <PaymentReminderRuleRow key={rule.id} rule={rule} />
          ))}
        </ul>
      )}
    </section>
  );
}
