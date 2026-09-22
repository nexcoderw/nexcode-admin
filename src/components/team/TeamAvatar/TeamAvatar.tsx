import Image from "next/image";

import { getTeamImageSource } from "@/utils/team/team-image-source";

import styles from "./TeamAvatar.module.css";

interface TeamAvatarProps {
  name: string | null;
  image: string | null;
  imagePng: string | null;
}

export function TeamAvatar({ name, image, imagePng }: TeamAvatarProps) {
  const source = getTeamImageSource(image ?? imagePng);

  if (source) {
    const localProxy = source.startsWith("/api/team/media");

    return (
      <span className={styles.avatar}>
        <Image
          src={source}
          alt=""
          fill
          sizes="44px"
          className={styles.image}
          unoptimized={localProxy}
        />
      </span>
    );
  }

  return (
    <span
      className={[styles.avatar, styles.fallback].join(" ")}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  );
}

function getInitials(name: string | null) {
  if (!name) {
    return "TM";
  }

  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "TM";
  }

  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}
