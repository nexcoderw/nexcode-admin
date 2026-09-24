"use client";

import {
  PAYMENT_API_ROUTES,
} from "@/constants/routes/payment-routes";
import {
  usePaymentMutation,
} from "@/hooks/payment/use-payment-mutation";

export function usePaymentNotifications() {
  const mutation =
    usePaymentMutation();

  function markRead(
    notificationId: number,
  ) {
    return mutation.mutate(
      PAYMENT_API_ROUTES
        .notificationRead(
          notificationId,
        ),
      {
        failureMessage:
          "The notification could not be marked as read.",
      },
    );
  }

  function markAllRead() {
    return mutation.mutate(
      PAYMENT_API_ROUTES
        .notificationsReadAll,
      {
        failureMessage:
          "The notifications could not be marked as read.",
      },
    );
  }

  function retry(
    notificationId: number,
  ) {
    return mutation.mutate(
      PAYMENT_API_ROUTES
        .notificationRetry(
          notificationId,
        ),
      {
        failureMessage:
          "The notification could not be retried.",
      },
    );
  }

  return {
    ...mutation,
    markRead,
    markAllRead,
    retry,
  };
}