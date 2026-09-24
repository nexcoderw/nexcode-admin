"use client";

import {
  useRouter,
} from "next/navigation";
import {
  useState,
} from "react";

import {
  AUTH_ROUTES,
} from "@/constants/routes/auth-routes";

interface MutationOptions {
  method?:
    | "POST"
    | "PATCH"
    | "DELETE";

  body?: unknown;

  failureMessage:
    string;
}

export function usePaymentMutation() {
  const router =
    useRouter();

  const [pending, setPending] =
    useState(false);

  const [error, setError] =
    useState<string | null>(
      null,
    );

  const [fields, setFields] =
    useState<string[]>([]);

  async function mutate<T>(
    url: string,
    options:
      MutationOptions,
  ): Promise<T | null> {
    setPending(true);
    setError(null);
    setFields([]);

    try {
      const response =
        await fetch(
          url,
          {
            method:
              options.method ??
              "POST",

            credentials:
              "same-origin",

            headers: {
              Accept:
                "application/json",

              ...(
                options.body !==
                undefined
                  ? {
                      "Content-Type":
                        "application/json",
                    }
                  : {}
              ),
            },

            body:
              options.body ===
              undefined
                ? undefined
                : JSON.stringify(
                    options.body,
                  ),
          },
        );

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        router.replace(
          AUTH_ROUTES.login,
        );

        return null;
      }

      const result =
        await response
          .json()
          .catch(
            () => null,
          );

      if (!response.ok) {
        setFields(
          Array.isArray(
            result?.fields,
          )
            ? result.fields
            : [],
        );

        setError(
          options.failureMessage,
        );

        return null;
      }

      router.refresh();

      return (
        result?.data ??
        {}
      ) as T;
    } catch {
      setError(
        options.failureMessage,
      );

      return null;
    } finally {
      setPending(false);
    }
  }

  function reset() {
    setError(null);
    setFields([]);
  }

  return {
    pending,
    error,
    fields,
    mutate,
    reset,
  };
}