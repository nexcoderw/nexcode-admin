import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import type {
  Metadata,
} from "next";
import {
  notFound,
  redirect,
} from "next/navigation";

import {
  DeleteAgreementDialog,
} from "@/components/payment/DeleteAgreementDialog/DeleteAgreementDialog";
import {
  PaymentAgreementForm,
} from "@/components/payment/PaymentAgreementForm/PaymentAgreementForm";
import {
  Alert,
} from "@/components/ui/Alert/Alert";
import {
  Button,
} from "@/components/ui/Button/Button";
import {
  Icon,
} from "@/components/ui/Icon/Icon";
import {
  AUTH_ROUTES,
} from "@/constants/routes/auth-routes";
import {
  ERROR_ROUTES,
} from "@/constants/routes/error-routes";
import {
  PAYMENT_ROUTES,
} from "@/constants/routes/payment-routes";
import {
  getPaymentAgreement,
} from "@/endpoints/payment/get-agreement";
import {
  parsePaymentId,
} from "@/utils/payment/payment-id";
import {
  getPaymentServerContext,
  listPaymentPortfolios,
} from "@/utils/payment/payment-server-data";

import styles from "./page.module.css";

export const metadata:
  Metadata = {
    title:
      "Edit Payment Agreement",
  };

interface EditPaymentPageProps {
  params:
    Promise<{
      id: string;
    }>;

  searchParams:
    Promise<{
      created?: string;
    }>;
}

export default async function EditPaymentPage({
  params,
  searchParams,
}: EditPaymentPageProps) {
  const context =
    await getPaymentServerContext();

  if (!context) {
    redirect(
      AUTH_ROUTES.login,
    );
  }

  const { id } =
    await params;

  const agreementId =
    parsePaymentId(id);

  if (!agreementId) {
    notFound();
  }

  const [
    agreementResult,
    portfolios,
    query,
  ] = await Promise.all([
    getPaymentAgreement(
      agreementId,
      context.sessionId,
      context.forwarded,
    ),

    listPaymentPortfolios(
      context,
    ),

    searchParams,
  ]);

  if (
    agreementResult.status ===
    404
  ) {
    notFound();
  }

  if (
    agreementResult.status ===
    401
  ) {
    redirect(
      ERROR_ROUTES.unauthorized,
    );
  }

  if (
    agreementResult.status ===
    403
  ) {
    redirect(
      ERROR_ROUTES.forbidden,
    );
  }

  if (
    !agreementResult.ok ||
    !agreementResult.data
  ) {
    return (
      <Alert
        variant="error"
        title="Agreement unavailable"
      >
        This payment agreement could not be loaded.
      </Alert>
    );
  }

  const agreement =
    agreementResult.data;

  return (
    <div
      className={
        styles.page
      }
    >
      <header
        className={
          styles.header
        }
      >
        <div
          className={
            styles.navigation
          }
        >
          <Button
            href={
              PAYMENT_ROUTES.list
            }
            variant="ghost"
            leftIcon={
              <Icon
                icon={
                  ArrowLeft01Icon
                }
                size={17}
              />
            }
          >
            Payments
          </Button>

          <Button
            href={
              PAYMENT_ROUTES.detail(
                agreement.id,
              )
            }
            variant="secondary"
            rightIcon={
              <Icon
                icon={
                  ArrowRight01Icon
                }
                size={17}
              />
            }
          >
            View details
          </Button>
        </div>

        <div
          className={
            styles.title
          }
        >
          <span>
            Financial management
          </span>

          <h1>
            Edit {agreement.title}
          </h1>
        </div>
      </header>

      {query.created ===
        "1" && (
        <Alert
          variant="success"
          title="Agreement created"
        >
          The agreement is ready. Configure its schedule, payments and
          reminders from the details page.
        </Alert>
      )}

      <PaymentAgreementForm
        mode="edit"
        agreement={
          agreement
        }
        portfolios={
          portfolios.ok
            ? portfolios.items
            : [
                {
                  id:
                    agreement
                      .portfolio.id,

                  name:
                    agreement
                      .portfolio.name,

                  slug:
                    agreement
                      .portfolio.slug,

                  summary: "",
                  category:
                    "web_application",
                  projectType:
                    "client_project",
                  status: "draft",
                  coverImage: null,
                  teamMemberCount:
                    0,
                  projectInitiationDate:
                    null,
                  deadlineDate:
                    null,
                  publishedAt:
                    null,
                  createdAt: "",
                  updatedAt: "",
                },
              ]
        }
      />

      <section
        className={
          styles.danger
        }
      >
        <div>
          <h2>
            Delete agreement
          </h2>

          <p>
            Deletion is available only while the agreement remains an unused
            draft.
          </p>
        </div>

        <DeleteAgreementDialog
          agreementId={
            agreement.id
          }
          title={
            agreement.title
          }
          disabled={
            agreement.status !==
            "draft"
          }
        />
      </section>
    </div>
  );
}