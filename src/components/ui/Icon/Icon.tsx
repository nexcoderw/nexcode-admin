import { HugeiconsIcon } from "@hugeicons/react";
import type { ComponentProps } from "react";

export type IconProps = ComponentProps<typeof HugeiconsIcon>;

export function Icon({
  size = 20,
  color = "currentColor",
  strokeWidth = 1.5,
  ...props
}: IconProps) {
  return (
    <HugeiconsIcon
      {...props}
      size={size}
      color={color}
      strokeWidth={strokeWidth}
    />
  );
}
