import {
  ComputerIcon,
  GlobeIcon,
  RoboticIcon,
  SmartPhone01Icon,
  Tablet01Icon,
} from "@hugeicons/core-free-icons";

import { Badge } from "@/components/ui/Badge/Badge";
import { Icon } from "@/components/ui/Icon/Icon";
import { CONTACT_DEVICE_LABELS } from "@/constants/contact/contact-options";
import type { Contact, ContactDeviceType } from "@/types/contact/contact";
import {
  describeContactDevice,
  formatContactDate,
  getContactInitials,
} from "@/utils/contact/contact-format";

import { ContactReplyDialog } from "../ContactReplyDialog/ContactReplyDialog";

import styles from "./ContactTable.module.css";

const DEVICE_ICONS: Record<ContactDeviceType, typeof ComputerIcon> = {
  desktop: ComputerIcon,
  mobile: SmartPhone01Icon,
  tablet: Tablet01Icon,
  bot: RoboticIcon,
  unknown: GlobeIcon,
};

interface ContactTableProps {
  items: Contact[];
}

export function ContactTable({ items }: ContactTableProps) {
  return (
    <div className={styles.frame}>
      {/* Scrolls sideways on narrow screens rather than hiding columns. */}
      <div className={styles.scroller}>
        <table className={styles.table}>
          <caption className={styles.srOnly}>
            Messages received from the website contact form
          </caption>

          <thead>
            <tr>
              <th scope="col">Sender</th>
              <th scope="col">Message</th>
              <th scope="col">Device</th>
              <th scope="col">IP address</th>
              <th scope="col">Received</th>
              <th scope="col">Status</th>
              <th scope="col" className={styles.actionHead}>
                <span className={styles.srOnly}>Actions</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((contact) => (
              <ContactRow key={contact.id} contact={contact} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ContactRow({ contact }: { contact: Contact }) {
  const received = formatContactDate(contact.createdAt);
  const unanswered = !contact.repliedAt;

  return (
    <tr className={unanswered ? styles.unanswered : undefined}>
      <td>
        <div className={styles.sender}>
          <span className={styles.monogram} aria-hidden="true">
            {getContactInitials(contact.name)}
          </span>

          <span className={styles.stack}>
            <strong>{contact.name}</strong>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </span>
        </div>
      </td>

      <td>
        <span className={`${styles.stack} ${styles.message}`}>
          <strong>{contact.subject}</strong>
          <span className={styles.preview}>{contact.message}</span>
        </span>
      </td>

      <td>
        <div className={styles.device} title={contact.userAgent ?? undefined}>
          <span className={styles.deviceIcon} aria-hidden="true">
            <Icon icon={DEVICE_ICONS[contact.deviceType]} size={17} />
          </span>

          <span className={styles.stack}>
            <span>{describeContactDevice(contact)}</span>
            <small>{CONTACT_DEVICE_LABELS[contact.deviceType]}</small>
          </span>
        </div>
      </td>

      <td>
        {contact.ipAddress ? (
          <code className={styles.ip}>{contact.ipAddress}</code>
        ) : (
          <span className={styles.missing}>Not recorded</span>
        )}
      </td>

      <td>
        <time className={styles.stack} dateTime={contact.createdAt}>
          <span>{received.date}</span>
          <small>{received.time}</small>
        </time>
      </td>

      <td>
        {unanswered ? (
          <Badge variant="warning" size="sm" showDot>
            New
          </Badge>
        ) : (
          <Badge variant="success" size="sm" showDot>
            Replied
          </Badge>
        )}
      </td>

      <td className={styles.action}>
        <ContactReplyDialog contact={contact} />
      </td>
    </tr>
  );
}
