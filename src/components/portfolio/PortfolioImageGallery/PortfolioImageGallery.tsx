import Image from "next/image";

import type { PortfolioImage } from "@/types/portfolio/portfolio";
import { getPortfolioImageSource } from "@/utils/portfolio/portfolio-image-source";

import styles from "./PortfolioImageGallery.module.css";

interface PortfolioImageGalleryProps {
  images: PortfolioImage[];

  /**
   * Fallback alt text for images stored without their own description.
   */
  portfolioName: string;
}

export function PortfolioImageGallery({
  images,
  portfolioName,
}: PortfolioImageGalleryProps) {
  // An image whose source cannot be resolved is dropped, so the count
  // below reflects what is actually rendered.
  const sources = images
    .map((image) => ({
      image,
      source: getPortfolioImageSource(image.image),
    }))
    .filter(
      (entry): entry is { image: PortfolioImage; source: string } =>
        Boolean(entry.source),
    );

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2>Gallery</h2>

        {sources.length > 0 && (
          <span className={styles.count}>
            {sources.length} {sources.length === 1 ? "image" : "images"}
          </span>
        )}
      </header>

      {sources.length === 0 ? (
        <p className={styles.empty}>
          No images have been uploaded for this portfolio yet.
        </p>
      ) : (
        <div className={styles.grid}>
          {sources.map(({ image, source }) => (
            <figure key={image.id} className={styles.tile}>
              <Image
                src={source}
                alt={image.altText || portfolioName}
                fill
                sizes="(max-width: 48rem) 50vw, 24rem"
                unoptimized={source.startsWith("/api/portfolio/media")}
              />
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
