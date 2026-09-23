import styles from "./PortfolioLinkSection.module.css";

export interface PortfolioSectionLink {
  id: number;
  label: string;
  url: string;
}

interface PortfolioLinkSectionProps {
  title: string;

  links: PortfolioSectionLink[];

  /**
   * Shown in place of the list when nothing has been linked yet.
   */
  emptyMessage: string;
}

/**
 * Renders one titled list of external links. Documents and repositories
 * are different records with the same presentation, so both are mapped
 * to PortfolioSectionLink by the caller.
 */
export function PortfolioLinkSection({
  title,
  links,
  emptyMessage,
}: PortfolioLinkSectionProps) {
  return (
    <section className={styles.section}>
      <h2>{title}</h2>

      {links.length === 0 ? (
        <p className={styles.empty}>{emptyMessage}</p>
      ) : (
        <div className={styles.linkList}>
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
