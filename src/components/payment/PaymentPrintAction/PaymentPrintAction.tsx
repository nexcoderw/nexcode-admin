"use client";

import {
  File01Icon,
} from "@hugeicons/core-free-icons";

import {
  Button,
} from "@/components/ui/Button/Button";
import {
  Icon,
} from "@/components/ui/Icon/Icon";

import styles from "./PaymentPrintAction.module.css";

interface PaymentPrintActionProps {
  pdfHref: string;
}

export function PaymentPrintAction({
  pdfHref,
}: PaymentPrintActionProps) {
  return (
    <div
      className={
        styles.actions
      }
      data-print-hidden
    >
      <Button
        type="button"
        variant="secondary"
        leftIcon={
          <Icon
            icon={
              File01Icon
            }
            size={17}
          />
        }
        onClick={() =>
          window.print()
        }
      >
        Print
      </Button>

      <Button
        href={pdfHref}
        leftIcon={
          <Icon
            icon={
              File01Icon
            }
            size={17}
          />
        }
      >
        Download PDF
      </Button>
    </div>
  );
}