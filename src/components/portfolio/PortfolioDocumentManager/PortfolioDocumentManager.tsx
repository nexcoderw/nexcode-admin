"use client";

import { File01Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { PortfolioDeleteAction } from "@/components/portfolio/PortfolioDeleteAction/PortfolioDeleteAction";
import { Alert } from "@/components/ui/Alert/Alert";
import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { Input } from "@/components/ui/Input/Input";
import { PORTFOLIO_API_ROUTES } from "@/constants/routes/portfolio-routes";
import type { PortfolioDocument } from "@/types/portfolio/portfolio";

import styles from "./PortfolioDocumentManager.module.css";

interface PortfolioDocumentManagerProps {
  portfolioId: number;
  documents: PortfolioDocument[];
}

export function PortfolioDocumentManager({
  portfolioId,
  documents,
}: PortfolioDocumentManagerProps) {
  const router = useRouter();

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  async function addDocument(form: HTMLFormElement) {
    const data = new FormData(form);

    setSaving(true);
    setError(null);

    try {
      const response = await fetch(
        PORTFOLIO_API_ROUTES.documentAdd(portfolioId),
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            title: data.get("title"),

            url: data.get("url"),
          }),
        },
      );

      if (!response.ok) {
        setError("The document link could not be added.");

        return;
      }

      form.reset();
      router.refresh();
    } catch {
      setError("The document link could not be added.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className={styles.section}>
      <header>
        <h2>Document links</h2>

        <p>Add any number of titled external document links.</p>
      </header>

      {error && (
        <Alert variant="error" title="Unable to add document">
          {error}
        </Alert>
      )}

      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();

          void addDocument(event.currentTarget);
        }}
      >
        <Input
          name="title"
          label="Document title"
          required
          placeholder="Project proposal"
        />

        <Input
          name="url"
          type="url"
          label="Document URL"
          required
          placeholder="https://..."
        />

        <Button
          type="submit"
          isLoading={saving}
          leftIcon={<Icon icon={File01Icon} size={17} />}
        >
          Add document
        </Button>
      </form>

      <div className={styles.list}>
        {documents.map((document) => (
          <article key={document.id} className={styles.item}>
            <div>
              <strong>{document.title}</strong>

              <a href={document.url} target="_blank" rel="noopener noreferrer">
                {document.url}
              </a>
            </div>

            <PortfolioDeleteAction
              resource="document"
              resourceId={document.id}
              name={document.title}
              compact
            />
          </article>
        ))}
      </div>
    </section>
  );
}
