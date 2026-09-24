"use client";

import {
  CancelCircleHalfDotIcon,
  FilterHorizontalIcon,
  FilterIcon,
  FilterResetIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import {
  useState,
} from "react";

import {
  Button,
} from "@/components/ui/Button/Button";
import {
  Dialog,
} from "@/components/ui/Dialog/Dialog";
import {
  Icon,
} from "@/components/ui/Icon/Icon";
import {
  Input,
} from "@/components/ui/Input/Input";
import {
  Select,
} from "@/components/ui/Select/Select";
import {
  CLIENT_ROUTES,
} from "@/constants/routes/client-routes";
import type {
  ResolvedClientListQuery,
} from "@/utils/client/client-page-query";

import styles from "./ClientFiltersDialog.module.css";

interface ClientFiltersDialogProps {
  query: ResolvedClientListQuery;
}

const STATUS_OPTIONS = [
  {
    value: "",
    label: "All statuses",
  },
  {
    value: "active",
    label: "Active",
  },
  {
    value: "inactive",
    label: "Inactive",
  },
  {
    value: "archived",
    label: "Archived",
  },
];

const ORDER_OPTIONS = [
  {
    value: "-created_at",
    label: "Newest first",
  },
  {
    value: "created_at",
    label: "Oldest first",
  },
  {
    value: "name",
    label: "Name A–Z",
  },
  {
    value: "-name",
    label: "Name Z–A",
  },
  {
    value: "company_name",
    label: "Company A–Z",
  },
  {
    value: "-company_name",
    label: "Company Z–A",
  },
  {
    value: "-updated_at",
    label: "Recently updated",
  },
];

export function ClientFiltersDialog({
  query,
}: ClientFiltersDialogProps) {
  const [open, setOpen] =
    useState(false);

  const activeCount =
    Number(
      Boolean(
        query.search,
      ),
    ) +
    Number(
      Boolean(
        query.status,
      ),
    ) +
    Number(
      query.ordering !==
        "-created_at",
    );

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        leftIcon={
          <Icon
            icon={
              FilterIcon
            }
            size={18}
          />
        }
        onClick={() =>
          setOpen(true)
        }
      >
        Filters

        {activeCount > 0 && (
          <span
            className={
              styles.count
            }
          >
            {activeCount}
          </span>
        )}
      </Button>

      <Dialog
        open={open}
        onClose={() =>
          setOpen(false)
        }
        title="Filter clients"
        description="Search clients and narrow the directory by status or sort order."
        size="md"
        closeLabel="Close client filters"
      >
        {open && (
          <form
            method="get"
            action={
              CLIENT_ROUTES.list
            }
            className={
              styles.form
            }
          >
            <Input
              name="search"
              type="search"
              label="Search"
              defaultValue={
                query.search
              }
              placeholder="Name, company, email, phone or location"
              maxLength={100}
              leftIcon={
                <Icon
                  icon={
                    Search01Icon
                  }
                  size={18}
                />
              }
            />

            <div
              className={
                styles.grid
              }
            >
              <Select
                name="status"
                label="Status"
                options={
                  STATUS_OPTIONS
                }
                defaultValue={
                  query.status
                }
                leftIcon={
                  <Icon
                    icon={
                      FilterHorizontalIcon
                    }
                    size={18}
                  />
                }
              />

              <Select
                name="ordering"
                label="Sort by"
                options={
                  ORDER_OPTIONS
                }
                defaultValue={
                  query.ordering
                }
                leftIcon={
                  <Icon
                    icon={
                      FilterHorizontalIcon
                    }
                    size={18}
                  />
                }
              />
            </div>

            <div
              className={
                styles.actions
              }
            >
              {activeCount > 0 && (
                <Button
                  href={
                    CLIENT_ROUTES.list
                  }
                  variant="ghost"
                  leftIcon={
                    <Icon
                      icon={
                        FilterResetIcon
                      }
                      size={18}
                    />
                  }
                  className={
                    styles.reset
                  }
                >
                  Reset
                </Button>
              )}

              <Button
                type="button"
                variant="secondary"
                leftIcon={
                  <Icon
                    icon={
                      CancelCircleHalfDotIcon
                    }
                    size={18}
                  />
                }
                onClick={() =>
                  setOpen(false)
                }
              >
                Cancel
              </Button>

              <Button
                type="submit"
                leftIcon={
                  <Icon
                    icon={
                      FilterIcon
                    }
                    size={18}
                  />
                }
              >
                Apply filters
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </>
  );
}