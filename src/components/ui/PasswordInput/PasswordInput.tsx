"use client";

import { ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";
import type { ComponentProps } from "react";
import { useState } from "react";

import { Icon } from "../Icon/Icon";
import { IconButton } from "../IconButton/IconButton";
import { Input } from "../Input/Input";

import styles from "./PasswordInput.module.css";

export interface PasswordInputProps extends Omit<
  ComponentProps<typeof Input>,
  "type" | "rightElement"
> {
  /**

* Accessible label for the button that reveals the password.
*
* @default "Show password"
  */
  showPasswordLabel?: string;

  /**

* Accessible label for the button that hides the password.
*
* @default "Hide password"
  */
  hidePasswordLabel?: string;
}

export function PasswordInput({
  showPasswordLabel = "Show password",
  hidePasswordLabel = "Hide password",
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible((current) => !current);
  };

  return (
    <Input
      {...props}
      type={isVisible ? "text" : "password"}
      rightElement={
        <IconButton
          type="button"
          variant="ghost"
          size="sm"
          className={styles.visibilityButton}
          icon={<Icon icon={isVisible ? ViewOffSlashIcon : ViewIcon} />}
          aria-label={isVisible ? hidePasswordLabel : showPasswordLabel}
          aria-pressed={isVisible}
          onClick={toggleVisibility}
        />
      }
    />
  );
}
