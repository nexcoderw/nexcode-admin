import {
  ArrowRight01Icon,
  Briefcase01Icon,
  File01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";

import {
  ClientDeleteAction,
} from "@/components/client/ClientDeleteAction/ClientDeleteAction";
import {
  Badge,
} from "@/components/ui/Badge/Badge";
import {
  Button,
} from "@/components/ui/Button/Button";
import {
  Icon,
} from "@/components/ui/Icon/Icon";
import {
  CLIENT_API_ROUTES,
  CLIENT_ROUTES,
} from "@/constants/routes/client-routes";
import type {
  ClientSummary,
} from "@/types/client/client";
import {
  formatClientDate,
  getClientStatusLabel,
  getClientStatusVariant,
} from "@/utils/client/client-format";
import {
  getClientImageSource,
} from "@/utils/client/client-image-source";

import styles from "./ClientCard.module.css";

interface ClientCardProps {
  client: ClientSummary;
}

export function ClientCard({
  client,
}: ClientCardProps) {
  const image =
    getClientImageSource(
      client.profileImage,
    );

  return (
    <article
      className={styles.card}
    >
      <div
        className={styles.media}
      >
        {image ? (
          <Image
            src={image}
            alt={client.name}
            fill
            sizes="(max-width: 36rem) 100vw, (max-width: 64rem) 50vw, 22rem"
            className={
              styles.image
            }
            unoptimized={
              image.startsWith(
                CLIENT_API_ROUTES.media,
              )
            }
          />
        ) : (
          <div
            className={
              styles.fallback
            }
          >
            <Icon
              icon={
                UserGroupIcon
              }
              size={32}
            />

            <span>
              No profile image
            </span>
          </div>
        )}

        <Badge
          variant={
            getClientStatusVariant(
              client.status,
            )
          }
          size="sm"
          className={
            styles.status
          }
        >
          {getClientStatusLabel(
            client.status,
          )}
        </Badge>
      </div>

      <div
        className={
          styles.content
        }
      >
        <span
          className={
            styles.company
          }
        >
          {client.companyName ||
            "Independent client"}
        </span>

        <h2
          className={
            styles.name
          }
        >
          {client.name}
        </h2>

        <dl
          className={
            styles.meta
          }
        >
          <div>
            <dt>Email</dt>

            <dd>
              {client.email ||
                "Not provided"}
            </dd>
          </div>

          <div>
            <dt>Location</dt>

            <dd>
              {client.location ||
                "Not provided"}
            </dd>
          </div>
        </dl>

        <div
          className={
            styles.actions
          }
        >
          <Button
            href={
              CLIENT_ROUTES.detail(
                client.id,
              )
            }
            variant="secondary"
            size="sm"
            leftIcon={
              <Icon
                icon={
                  ArrowRight01Icon
                }
                size={16}
              />
            }
          >
            Details
          </Button>

          <Button
            href={
              CLIENT_ROUTES.edit(
                client.id,
              )
            }
            variant="ghost"
            size="sm"
            leftIcon={
              <Icon
                icon={File01Icon}
                size={16}
              />
            }
          >
            Edit
          </Button>

          <ClientDeleteAction
            clientId={
              client.id
            }
            name={
              client.name
            }
            compact
          />
        </div>
      </div>

      <footer
        className={
          styles.footer
        }
      >
        <span>
          <Icon
            icon={
              Briefcase01Icon
            }
            size={14}
          />

          @{client.slug}
        </span>

        <span>
          Updated{" "}
          {formatClientDate(
            client.updatedAt,
          )}
        </span>
      </footer>
    </article>
  );
}