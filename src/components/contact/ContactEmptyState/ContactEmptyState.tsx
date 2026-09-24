import { FilterResetIcon, InboxIcon } from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { CONTACT_ROUTES } from "@/constants/routes/contact-routes";

import styles from "./ContactEmptyState.module.css";

interface ContactEmptyStateProps {
  filtered: boolean;
}

export function ContactEmptyState({ filtered }: ContactEmptyStateProps) {
  return (
    <section className={styles.empty}>
      <span className={styles.icon}>
        <Icon icon={InboxIcon} size={28} />
      </span>

      <div className={styles.content}>
        <h2>{filtered ? "No matching messages" : "No messages yet"}</h2>

        <p>
          {filtered
            ? "No message matches these filters. Try a different search or status."
            : "Messages sent from the website's contact page will appear here, ready to answer."}
        </p>
      </div>

      {filtered && (
        <Button
          href={CONTACT_ROUTES.list}
          variant="secondary"
          leftIcon={<Icon icon={FilterResetIcon} size={17} />}
        >
          Reset filters
        </Button>
      )}
    </section>
  );
}
