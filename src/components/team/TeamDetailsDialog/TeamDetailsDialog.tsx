"use client";

import {
  Edit02Icon,
  GithubIcon,
  Linkedin01Icon,
  UserIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/Button/Button";
import { Dialog } from "@/components/ui/Dialog/Dialog";
import { Icon } from "@/components/ui/Icon/Icon";
import type { TeamMember } from "@/types/team/team";
import { getTeamImageSource } from "@/utils/team/team-image-source";

import { TeamDeleteAction } from "../TeamDeleteAction/TeamDeleteAction";
import { TeamFormDialog } from "../TeamFormDialog/TeamFormDialog";

import styles from "./TeamDetailsDialog.module.css";

interface TeamDetailsDialogProps {
  member: TeamMember;
  showTriggerLabel?: boolean;
}

export function TeamDetailsDialog({
  member,
  showTriggerLabel = false,
}: TeamDetailsDialogProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const name = member.name ?? "Unnamed member";
  const image = getTeamImageSource(member.image);
  const cutout = getTeamImageSource(member.imagePng);

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        iconOnly={!showTriggerLabel}
        leftIcon={<Icon icon={ViewIcon} size={showTriggerLabel ? 9 : 10} />}
        aria-label={`View ${name}`}
        title={`View ${name}`}
        onClick={() => setOpen(true)}
      >
        View {name}
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={name}
        description={member.position ?? "No position specified"}
        size="lg"
        className={styles.memberDialog}
        closeLabel={`Close ${name} details`}
        footer={
          open ? (
            <div className={styles.footerActions}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>

              <Button
                type="button"
                leftIcon={<Icon icon={Edit02Icon} size={17} />}
                onClick={() => {
                  setOpen(false);
                  setEditing(true);
                }}
              >
                Edit profile
              </Button>
            </div>
          ) : undefined
        }
      >
        {open && (
          <div className={styles.layout}>
            <section className={styles.visual} aria-label={`${name} imagery`}>
              <div className={styles.portrait}>
                {image ? (
                  <Image
                    src={image}
                    alt={`${name} profile portrait`}
                    fill
                    sizes="(max-width: 52rem) calc(100vw - 4rem), 18rem"
                    className={styles.portraitImage}
                    unoptimized={image.startsWith("/api/team/media")}
                  />
                ) : (
                  <div className={styles.imageFallback}>
                    <Icon icon={UserIcon} size={38} />
                    <span>Profile image unavailable</span>
                  </div>
                )}

                <span className={styles.portraitLabel}>Profile image</span>

                <div className={styles.cutout}>
                  {cutout ? (
                    <Image
                      src={cutout}
                      alt={`${name} transparent cutout`}
                      fill
                      sizes="7rem"
                      className={styles.cutoutImage}
                      unoptimized={cutout.startsWith("/api/team/media")}
                    />
                  ) : (
                    <div className={styles.cutoutFallback}>No cutout</div>
                  )}

                  <span className={styles.cutoutLabel}>PNG</span>
                </div>
              </div>

              <div className={styles.identityStrip}>
                <span>Team profile</span>
                <strong>@{member.slug}</strong>
              </div>
            </section>

            <div className={styles.information}>
              <section className={styles.section}>
                <div className={styles.sectionHeading}>
                  <h3>Profile information</h3>
                  <p>Public identity and record history.</p>
                </div>

                <dl className={styles.details}>
                  <DetailRow
                    label="Position"
                    value={member.position ?? "Not specified"}
                  />
                  <DetailRow label="Profile handle" value={`@${member.slug}`} />
                  <DetailRow
                    label="Display order"
                    value={`No. ${member.displayOrder}`}
                  />
                  <DetailRow
                    label="Joined"
                    value={formatDate(member.createdAt)}
                  />
                  <DetailRow
                    label="Last updated"
                    value={formatDate(member.updatedAt)}
                  />
                </dl>
              </section>

              <section className={styles.section}>
                <div className={styles.sectionHeading}>
                  <h3>Professional profiles</h3>
                  <p>External profiles connected to this team member.</p>
                </div>

                <div className={styles.profileLinks}>
                  {member.linkedin ? (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.profileLink}
                    >
                      <Icon icon={Linkedin01Icon} size={19} />
                      <span>
                        <strong>LinkedIn</strong>
                        <small>Open professional profile</small>
                      </span>
                    </a>
                  ) : (
                    <MissingProfile name="LinkedIn" />
                  )}

                  {member.github ? (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.profileLink}
                    >
                      <Icon icon={GithubIcon} size={19} />
                      <span>
                        <strong>GitHub</strong>
                        <small>Open code profile</small>
                      </span>
                    </a>
                  ) : (
                    <MissingProfile name="GitHub" />
                  )}
                </div>
              </section>

              <section className={styles.dangerZone}>
                <div>
                  <h3>Remove team member</h3>
                  <p>Permanently delete this profile and its managed media.</p>
                </div>

                <TeamDeleteAction teamId={member.id} teamName={member.name} />
              </section>
            </div>
          </div>
        )}
      </Dialog>

      <TeamFormDialog
        mode="edit"
        teamMember={member}
        open={editing}
        onClose={() => setEditing(false)}
      />
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.detailRow}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function MissingProfile({ name }: { name: string }) {
  return (
    <div className={styles.missingProfile}>
      <span>{name}</span>
      <small>Not provided</small>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unavailable";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
