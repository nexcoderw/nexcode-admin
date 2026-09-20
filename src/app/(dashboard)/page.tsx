import {
  ArrowRight01Icon,
  Briefcase01Icon,
  File01Icon,
  Mail01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import type { Metadata } from "next";
import Link from "next/link";

import { Icon } from "@/components/ui/Icon/Icon";
import { ROUTES } from "@/constants/routes";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Dashboard",
};

const metrics = [
  {
    label: "Portfolios",
    value: "—",
    description:
      "Projects managed by NEXCODE",
    icon: Briefcase01Icon,
  },
  {
    label: "Clients",
    value: "—",
    description:
      "Registered client records",
    icon: UserGroupIcon,
  },
  {
    label: "Blogs",
    value: "—",
    description:
      "Published and draft articles",
    icon: File01Icon,
  },
  {
    label: "Contacts",
    value: "—",
    description:
      "Website contact messages",
    icon: Mail01Icon,
  },
];

const managementLinks = [
  {
    label: "Portfolios",
    description:
      "Manage projects, project files and details.",
    href: ROUTES.admin.portfolios,
  },
  {
    label: "Clients",
    description:
      "Manage NEXCODE client information.",
    href: ROUTES.admin.clients,
  },
  {
    label: "Blogs",
    description:
      "Create and manage website articles.",
    href: ROUTES.admin.blogs,
  },
  {
    label: "Trainings",
    description:
      "Manage training content and programmes.",
    href: ROUTES.admin.trainings,
  },
  {
    label: "Payments",
    description:
      "Review portfolio payments and statuses.",
    href: ROUTES.admin.payments,
  },
  {
    label: "Contacts",
    description:
      "Review messages received from the website.",
    href: ROUTES.admin.contacts,
  },
];

export default function DashboardPage() {
  return (
    <div className={styles.dashboard}>
      <section
        className={styles.introduction}
      >
        <div>
          <span
            className={
              styles.sectionLabel
            }
          >
            Platform overview
          </span>

          <h2 className={styles.heading}>
            NEXCODE at a glance
          </h2>

          <p
            className={
              styles.description
            }
          >
            Monitor the main areas of the
            platform and quickly access
            administrative operations.
          </p>
        </div>
      </section>

      <section
        className={styles.metrics}
        aria-label="Platform statistics"
      >
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className={styles.metric}
          >
            <div
              className={
                styles.metricHeader
              }
            >
              <span
                className={
                  styles.metricIcon
                }
              >
                <Icon
                  icon={metric.icon}
                  size={20}
                />
              </span>

              <span
                className={
                  styles.metricLabel
                }
              >
                {metric.label}
              </span>
            </div>

            <strong
              className={
                styles.metricValue
              }
            >
              {metric.value}
            </strong>

            <p
              className={
                styles.metricDescription
              }
            >
              {metric.description}
            </p>
          </article>
        ))}
      </section>

      <div
        className={styles.contentGrid}
      >
        <section
          className={styles.panel}
        >
          <header
            className={
              styles.panelHeader
            }
          >
            <div>
              <h3
                className={
                  styles.panelTitle
                }
              >
                Management
              </h3>

              <p
                className={
                  styles.panelDescription
                }
              >
                Frequently used
                administrative areas.
              </p>
            </div>
          </header>

          <div
            className={
              styles.managementList
            }
          >
            {managementLinks.map(
              (item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    styles.managementItem
                  }
                >
                  <div
                    className={
                      styles.managementContent
                    }
                  >
                    <strong>
                      {item.label}
                    </strong>

                    <span>
                      {item.description}
                    </span>
                  </div>

                  <span
                    className={
                      styles.managementArrow
                    }
                    aria-hidden="true"
                  >
                    <Icon
                      icon={
                        ArrowRight01Icon
                      }
                      size={18}
                    />
                  </span>
                </Link>
              ),
            )}
          </div>
        </section>

        <section
          className={styles.panel}
        >
          <header
            className={
              styles.panelHeader
            }
          >
            <div>
              <h3
                className={
                  styles.panelTitle
                }
              >
                Recent activity
              </h3>

              <p
                className={
                  styles.panelDescription
                }
              >
                Latest administrative and
                platform changes.
              </p>
            </div>
          </header>

          <div
            className={
              styles.emptyActivity
            }
          >
            <span
              className={
                styles.emptyIcon
              }
              aria-hidden="true"
            >
              <Icon
                icon={File01Icon}
                size={22}
              />
            </span>

            <div>
              <strong>
                No activity available yet
              </strong>

              <p>
                Recent activity will appear
                here once the dashboard API
                is connected.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
