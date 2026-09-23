"use client";

import { GithubIcon } from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { PortfolioDeleteAction } from "@/components/portfolio/PortfolioDeleteAction/PortfolioDeleteAction";
import { Alert } from "@/components/ui/Alert/Alert";
import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { Input } from "@/components/ui/Input/Input";
import { PORTFOLIO_API_ROUTES } from "@/constants/routes/portfolio-routes";
import type { PortfolioRepository } from "@/types/portfolio/portfolio";

import styles from "./PortfolioRepositoryManager.module.css";

interface PortfolioRepositoryManagerProps {
  portfolioId: number;
  repositories: PortfolioRepository[];
}

export function PortfolioRepositoryManager({
  portfolioId,
  repositories,
}: PortfolioRepositoryManagerProps) {
  const router = useRouter();

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  async function addRepository(form: HTMLFormElement) {
    const data = new FormData(form);
    const url = String(data.get("url") ?? "").trim();

    setError(null);

    if (repositories.some((repository) => repository.url === url)) {
      setError("This repository link already exists for this portfolio.");

      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        PORTFOLIO_API_ROUTES.repositoryAdd(portfolioId),
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            label: data.get("label"),

            url,
          }),
        },
      );

      if (!response.ok) {
        setError(
          response.status === 400
            ? "This repository URL is invalid or already exists for this portfolio."
            : "The repository link could not be added.",
        );

        return;
      }

      form.reset();
      router.refresh();
    } catch {
      setError("The repository link could not be added.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className={styles.section}>
      <header>
        <h2>Repository links</h2>

        <p>Add any number of labelled source repository links.</p>
      </header>

      {error && (
        <Alert variant="error" title="Unable to add repository">
          {error}
        </Alert>
      )}

      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();

          void addRepository(event.currentTarget);
        }}
      >
        <Input
          name="label"
          label="Repository label"
          required
          placeholder="GitHub"
        />

        <Input
          name="url"
          type="url"
          label="Repository URL"
          required
          placeholder="https://github.com/..."
        />

        <Button
          type="submit"
          isLoading={saving}
          leftIcon={<Icon icon={GithubIcon} size={17} />}
        >
          Add repository
        </Button>
      </form>

      <div className={styles.list}>
        {repositories.map((repository) => (
          <RepositoryRow
            key={repository.id}
            repository={repository}
          />
        ))}
      </div>
    </section>
  );
}

/**
 * A stored repository link, edited in place. Each row owns its own
 * saving and error state so one failing row never blocks the others.
 */
function RepositoryRow({
  repository,
}: {
  repository: PortfolioRepository;
}) {
  const router = useRouter();

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  async function updateRepository(form: HTMLFormElement) {
    const data = new FormData(form);

    setSaving(true);
    setError(null);

    try {
      const response = await fetch(
        PORTFOLIO_API_ROUTES.repositoryUpdate(repository.id),
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            label: data.get("label"),

            url: data.get("url"),
          }),
        },
      );

      if (!response.ok) {
        setError("The repository link could not be saved.");

        return;
      }

      router.refresh();
    } catch {
      setError("The repository link could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <article className={styles.item}>
      <form
        className={styles.itemForm}
        onSubmit={(event) => {
          event.preventDefault();

          void updateRepository(event.currentTarget);
        }}
      >
        <Input
          name="label"
          label="Label"
          required
          defaultValue={repository.label}
          disabled={saving}
        />

        <Input
          name="url"
          type="url"
          label="URL"
          required
          defaultValue={repository.url}
          disabled={saving}
        />

        <div className={styles.itemActions}>
          <Button
            type="submit"
            variant="secondary"
            isLoading={saving}
            loadingLabel="Saving repository"
          >
            Save
          </Button>

          <PortfolioDeleteAction
            resource="repository"
            resourceId={repository.id}
            name={repository.label}
            compact
          />
        </div>
      </form>

      {error && (
        <p className={styles.itemError} role="alert">
          {error}
        </p>
      )}
    </article>
  );
}
