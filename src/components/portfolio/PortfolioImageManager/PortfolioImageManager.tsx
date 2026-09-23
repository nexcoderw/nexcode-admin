"use client";

import { File01Icon } from "@hugeicons/core-free-icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { PortfolioDeleteAction } from "@/components/portfolio/PortfolioDeleteAction/PortfolioDeleteAction";
import { Alert } from "@/components/ui/Alert/Alert";
import { Button } from "@/components/ui/Button/Button";
import { Checkbox } from "@/components/ui/Checkbox/Checkbox";
import { Icon } from "@/components/ui/Icon/Icon";
import { Input } from "@/components/ui/Input/Input";
import { API_ROUTES } from "@/constants/routes";
import type { PortfolioImage } from "@/types/portfolio/portfolio";
import { getPortfolioImageSource } from "@/utils/portfolio/portfolio-image-source";

import styles from "./PortfolioImageManager.module.css";

interface PortfolioImageManagerProps {
  portfolioId: number;
  images: PortfolioImage[];
}

export function PortfolioImageManager({
  portfolioId,
  images,
}: PortfolioImageManagerProps) {
  const router = useRouter();

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  async function addImage(form: HTMLFormElement) {
    setSaving(true);
    setError(null);

    const native = new FormData(form);

    const payload = new FormData();

    const file = native.get("image");

    if (file instanceof File && file.size > 0) {
      payload.set("image", file);
    }

    payload.set("altText", String(native.get("altText") ?? ""));

    payload.set("position", String(native.get("position") ?? "0"));

    payload.set("isCover", native.has("isCover") ? "true" : "false");

    try {
      const response = await fetch(API_ROUTES.portfolio.imageAdd(portfolioId), {
        method: "POST",
        body: payload,
      });

      if (!response.ok) {
        setError("The image could not be added.");

        return;
      }

      form.reset();
      router.refresh();
    } catch {
      setError("The image could not be added.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className={styles.section}>
      <header>
        <div>
          <h2>Portfolio images</h2>

          <p>Upload project imagery and select a single cover image.</p>
        </div>
      </header>

      {error && (
        <Alert variant="error" title="Unable to save image">
          {error}
        </Alert>
      )}

      <form
        className={styles.addForm}
        onSubmit={(event) => {
          event.preventDefault();

          void addImage(event.currentTarget);
        }}
      >
        <Input
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          label="Image"
          required
        />

        <Input name="altText" label="Alt text" showOptional />

        <Input
          name="position"
          type="number"
          min={0}
          defaultValue="0"
          label="Position"
        />

        <Checkbox name="isCover" label="Use as cover" />

        <Button
          type="submit"
          isLoading={saving}
          leftIcon={<Icon icon={File01Icon} size={17} />}
        >
          Add image
        </Button>
      </form>

      <div className={styles.grid}>
        {images.map((image) => {
          const source = getPortfolioImageSource(image.image);

          return (
            <article key={image.id} className={styles.card}>
              <div className={styles.preview}>
                {source && (
                  <Image
                    src={source}
                    alt={image.altText || "Portfolio image"}
                    fill
                    sizes="280px"
                    className={styles.image}
                    unoptimized={source.startsWith("/api/portfolio/media")}
                  />
                )}
              </div>

              <div className={styles.meta}>
                <strong>
                  {image.isCover ? "Cover image" : `Image ${image.position}`}
                </strong>

                <span>{image.altText || "No alt text"}</span>
              </div>

              <PortfolioDeleteAction
                resource="image"
                resourceId={image.id}
                name={image.altText || `image ${image.id}`}
                compact
              />
            </article>
          );
        })}
      </div>
    </section>
  );
}
