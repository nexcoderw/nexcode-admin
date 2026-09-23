"use client";

import type { KeyboardEvent } from "react";
import { useState } from "react";

import { PortfolioDocumentManager } from "@/components/portfolio/PortfolioDocumentManager/PortfolioDocumentManager";
import { PortfolioForm } from "@/components/portfolio/PortfolioForm/PortfolioForm";
import type { PortfolioFormTeamMember } from "@/components/portfolio/PortfolioForm/PortfolioForm";
import { PortfolioImageManager } from "@/components/portfolio/PortfolioImageManager/PortfolioImageManager";
import { PortfolioRepositoryManager } from "@/components/portfolio/PortfolioRepositoryManager/PortfolioRepositoryManager";
import type { PortfolioDetail } from "@/types/portfolio/portfolio";

import styles from "./PortfolioWorkspace.module.css";

interface PortfolioWorkspaceProps {
  mode: "add" | "edit";

  portfolio?: PortfolioDetail;

  teamMembers: PortfolioFormTeamMember[];
}

type TabId = "details" | "images" | "documents" | "repositories";

interface TabDefinition {
  id: TabId;
  label: string;

  /**
   * Shown beside the label once the project exists.
   */
  count?: number;
}

export function PortfolioWorkspace({
  mode,
  portfolio,
  teamMembers,
}: PortfolioWorkspaceProps) {
  const [active, setActive] = useState<TabId>("details");

  // Images and links attach to a portfolio id, so they cannot be filled
  // in until the project itself has been created.
  const locked = !portfolio;

  const tabs: TabDefinition[] = [
    { id: "details", label: "Details" },
    { id: "images", label: "Images", count: portfolio?.images.length },
    {
      id: "documents",
      label: "Documents",
      count: portfolio?.documents.length,
    },
    {
      id: "repositories",
      label: "Repositories",
      count: portfolio?.repositories.length,
    },
  ];

  function selectTab(id: TabId) {
    if (id !== "details" && locked) {
      return;
    }

    setActive(id);
  }

  /**
   * Left and right move between tabs, Home and End jump to the ends —
   * the keyboard behaviour expected of a tab list.
   */
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const order = tabs
      .filter((tab) => tab.id === "details" || !locked)
      .map((tab) => tab.id);

    const current = order.indexOf(active);

    const next = {
      ArrowRight: order[(current + 1) % order.length],
      ArrowLeft: order[(current - 1 + order.length) % order.length],
      Home: order[0],
      End: order[order.length - 1],
    }[event.key];

    if (!next) {
      return;
    }

    event.preventDefault();
    setActive(next);
  }

  return (
    <div className={styles.workspace}>
      <div
        className={styles.tabs}
        role="tablist"
        aria-label="Portfolio sections"
        onKeyDown={handleKeyDown}
      >
        {tabs.map((tab) => {
          const disabled = tab.id !== "details" && locked;
          const selected = active === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`portfolio-tab-${tab.id}`}
              className={styles.tab}
              aria-controls={`portfolio-panel-${tab.id}`}
              aria-selected={selected}
              aria-disabled={disabled || undefined}
              data-selected={selected || undefined}
              tabIndex={selected ? 0 : -1}
              onClick={() => selectTab(tab.id)}
            >
              <span>{tab.label}</span>

              {typeof tab.count === "number" && (
                <span className={styles.count}>{tab.count}</span>
              )}
            </button>
          );
        })}
      </div>

      {locked && active === "details" && (
        <p className={styles.lockedHint}>
          Images, documents and repositories unlock as soon as this project is
          created.
        </p>
      )}

      <div
        className={styles.panel}
        role="tabpanel"
        id={`portfolio-panel-${active}`}
        aria-labelledby={`portfolio-tab-${active}`}
        tabIndex={-1}
      >
        {active === "details" && (
          <PortfolioForm
            mode={mode}
            portfolio={portfolio}
            teamMembers={teamMembers}
          />
        )}

        {active === "images" && portfolio && (
          <PortfolioImageManager
            portfolioId={portfolio.id}
            images={portfolio.images}
          />
        )}

        {active === "documents" && portfolio && (
          <PortfolioDocumentManager
            portfolioId={portfolio.id}
            documents={portfolio.documents}
          />
        )}

        {active === "repositories" && portfolio && (
          <PortfolioRepositoryManager
            portfolioId={portfolio.id}
            repositories={portfolio.repositories}
          />
        )}
      </div>
    </div>
  );
}
