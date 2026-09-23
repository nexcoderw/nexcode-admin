import { LinkSquare02Icon } from "@hugeicons/core-free-icons";

import { Icon } from "@/components/ui/Icon/Icon";

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
      <header className={styles.header}>
        <h2>{title}</h2>

        {links.length > 0 && (
          <span className={styles.count}>{links.length}</span>
        )}
      </header>

      {links.length === 0 ? (
        <p className={styles.empty}>{emptyMessage}</p>
      ) : (
        <ul className={styles.list}>
          {links.map((link) => (
            <li key={link.id}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                <span className={styles.text}>
                  <strong>{link.label}</strong>

                  <small>{linkHost(link.url)}</small>
                </span>

                <Icon icon={LinkSquare02Icon} size={17} />
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/**
 * The host tells the reader where a link goes before they follow it.
 * A stored value that will not parse falls back to the raw string.
 */
function linkHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
