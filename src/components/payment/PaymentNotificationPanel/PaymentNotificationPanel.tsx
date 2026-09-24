"use client";

import {
  Mail01Icon,
} from "@hugeicons/core-free-icons";

import {
  Alert,
} from "@/components/ui/Alert/Alert";
import {
  Badge,
} from "@/components/ui/Badge/Badge";
import {
  Button,
} from "@/components/ui/Button/Button";
import {
  Icon,
} from "@/components/ui/Icon/Icon";
import {
  usePaymentNotifications,
} from "@/hooks/payment/use-payment-notifications";
import type {
  PaymentNotification,
} from "@/types/payment/reminder";
import {
  formatPaymentDate,
} from "@/utils/payment/payment-format";

import styles from "./PaymentNotificationPanel.module.css";

interface PaymentNotificationPanelProps {
  notifications:
    PaymentNotification[];
}

export function PaymentNotificationPanel({
  notifications,
}: PaymentNotificationPanelProps) {
  const actions =
    usePaymentNotifications();

  const unread =
    notifications.filter(
      (notification) =>
        !notification.isRead,
    ).length;

  return (
    <section
      className={
        styles.panel
      }
    >
      <header
        className={
          styles.header
        }
      >
        <div>
          <span>
            Notifications
          </span>

          <h2>
            Payment reminders
          </h2>
        </div>

        {unread > 0 && (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={
              actions.pending
            }
            onClick={() =>
              void actions
                .markAllRead()
            }
          >
            Mark all read
          </Button>
        )}
      </header>

      {actions.error && (
        <Alert
          variant="error"
          title="Notification action failed"
        >
          {actions.error}
        </Alert>
      )}

      {notifications.length ===
      0 ? (
        <div
          className={
            styles.empty
          }
        >
          <Icon
            icon={
              Mail01Icon
            }
            size={22}
          />

          <span>
            No payment notifications yet.
          </span>
        </div>
      ) : (
        <div
          className={
            styles.list
          }
        >
          {notifications.map(
            (
              notification,
            ) => (
              <article
                key={
                  notification.id
                }
                className={
                  styles.notification
                }
                data-unread={
                  !notification
                    .isRead ||
                  undefined
                }
              >
                <div
                  className={
                    styles.notificationHeader
                  }
                >
                  <div>
                    <strong>
                      {
                        notification
                          .title
                      }
                    </strong>

                    <span>
                      {formatPaymentDate(
                        notification
                          .triggerDate,
                      )}
                    </span>
                  </div>

                  <Badge
                    size="sm"
                    variant={
                      notification
                        .status ===
                      "failed"
                        ? "error"
                        : "neutral"
                    }
                  >
                    {
                      notification
                        .channel
                    }
                  </Badge>
                </div>

                <p>
                  {
                    notification
                      .message
                  }
                </p>

                <footer>
                  {!notification
                    .isRead && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        void actions
                          .markRead(
                            notification.id,
                          )
                      }
                    >
                      Mark read
                    </Button>
                  )}

                  {notification
                    .status ===
                    "failed" && (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        void actions
                          .retry(
                            notification.id,
                          )
                      }
                    >
                      Retry
                    </Button>
                  )}
                </footer>
              </article>
            ),
          )}
        </div>
      )}
    </section>
  );
}