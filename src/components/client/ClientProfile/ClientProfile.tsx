import {
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";

import {
  Badge,
} from "@/components/ui/Badge/Badge";
import {
  Icon,
} from "@/components/ui/Icon/Icon";
import {
  CLIENT_API_ROUTES,
} from "@/constants/routes/client-routes";
import type {
  ClientDetail,
} from "@/types/client/client";
import {
  formatClientDate,
  getClientStatusLabel,
  getClientStatusVariant,
} from "@/utils/client/client-format";
import {
  getClientImageSource,
} from "@/utils/client/client-image-source";

import styles from "./ClientProfile.module.css";

interface ClientProfileProps {
  client: ClientDetail;
}

export function ClientProfile({
  client,
}: ClientProfileProps) {
  const image =
    getClientImageSource(
      client.profileImage,
    );

  return (
    <section
      className={
        styles.profile
      }
    >
      <div
        className={
          styles.identity
        }
      >
        <div
          className={
            styles.media
          }
        >
          {image ? (
            <Image
              src={image}
              alt={client.name}
              fill
              sizes="10rem"
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
                size={38}
              />
            </div>
          )}
        </div>

        <div
          className={
            styles.heading
          }
        >
          <Badge
            variant={
              getClientStatusVariant(
                client.status,
              )
            }
            showDot
          >
            {getClientStatusLabel(
              client.status,
            )}
          </Badge>

          <div>
            <h1>
              {client.name}
            </h1>

            <p>
              {client.companyName ||
                "Independent client"}
            </p>
          </div>

          <span
            className={
              styles.slug
            }
          >
            @{client.slug}
          </span>
        </div>
      </div>

      <div
        className={
          styles.record
        }
      >
        <Record
          label="Email"
          value={
            client.email
          }
        />

        <Record
          label="Phone"
          value={
            client.phone
          }
        />

        <Record
          label="Location"
          value={
            client.location
          }
        />

        <Record
          label="Website"
          value={
            client.website
          }
          url
        />

        <Record
          label="Created"
          value={
            formatClientDate(
              client.createdAt,
            )
          }
        />

        <Record
          label="Updated"
          value={
            formatClientDate(
              client.updatedAt,
            )
          }
        />
      </div>

      <div
        className={
          styles.notes
        }
      >
        <h2>
          Internal notes
        </h2>

        <p>
          {client.notes ||
            "No internal notes have been added for this client."}
        </p>
      </div>
    </section>
  );
}

function Record({
  label,
  value,
  url = false,
}: {
  label: string;
  value:
    | string
    | null;
  url?: boolean;
}) {
  return (
    <div>
      <dt>{label}</dt>

      <dd>
        {!value ? (
          "Not provided"
        ) : url ? (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}