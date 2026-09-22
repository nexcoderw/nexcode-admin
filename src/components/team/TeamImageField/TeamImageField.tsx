"use client";

import {
  Cancel01Icon,
  Image01Icon,
  Upload01Icon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import { type ChangeEvent, useEffect, useId, useState } from "react";

import { Button } from "@/components/ui/Button/Button";
import { Icon } from "@/components/ui/Icon/Icon";
import { getTeamImageSource } from "@/utils/team/team-image-source";

import styles from "./TeamImageField.module.css";

interface TeamImageFieldProps {
  name: "image" | "image_png";
  label: string;
  description: string;
  accept: string;
  currentImage?: string | null;
  error?: string;
  disabled?: boolean;
  removable?: boolean;
  onFileChange: (file: File | null) => void;
  onRemoveChange?: (remove: boolean) => void;
}

export function TeamImageField({
  name,
  label,
  description,
  accept,
  currentImage = null,
  error,
  disabled = false,
  removable = false,
  onFileChange,
  onRemoveChange,
}: TeamImageFieldProps) {
  const inputId = useId();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    if (!selectedFile) {
      setObjectUrl(null);
      return;
    }

    const nextUrl = URL.createObjectURL(selectedFile);

    setObjectUrl(nextUrl);

    return () => {
      URL.revokeObjectURL(nextUrl);
    };
  }, [selectedFile]);

  const currentSource = getTeamImageSource(currentImage);

  const previewSource = removed ? null : (objectUrl ?? currentSource);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    setSelectedFile(file);
    setRemoved(false);

    onFileChange(file);
    onRemoveChange?.(false);
  }

  function handleRemove() {
    setSelectedFile(null);
    setRemoved(true);

    onFileChange(null);
    onRemoveChange?.(true);
  }

  function handleRestore() {
    setRemoved(false);
    onRemoveChange?.(false);
  }

  return (
    <div className={styles.field}>
      <div className={styles.heading}>
        <div>
          <label className={styles.label} htmlFor={inputId}>
            {label}
          </label>

          <p className={styles.description}>{description}</p>
        </div>
      </div>

      <div
        className={[styles.content, error ? styles.hasError : ""]
          .filter(Boolean)
          .join(" ")}
      >
        <div className={styles.preview}>
          {previewSource ? (
            <Image
              src={previewSource}
              alt={`${label} preview`}
              fill
              sizes="180px"
              className={styles.previewImage}
              unoptimized={
                previewSource.startsWith("/api/team/media") ||
                previewSource.startsWith("blob:")
              }
            />
          ) : (
            <div className={styles.placeholder}>
              <Icon icon={Image01Icon} size={26} />

              <span>
                {removed ? "Image will be removed" : "No image selected"}
              </span>
            </div>
          )}
        </div>

        <div className={styles.controls}>
          <div>
            <input
              id={inputId}
              name={name}
              type="file"
              accept={accept}
              disabled={disabled}
              onChange={handleChange}
              className={styles.nativeInput}
            />

            <label
              htmlFor={inputId}
              className={[styles.uploadAction, disabled ? styles.disabled : ""]
                .filter(Boolean)
                .join(" ")}
            >
              <Icon icon={Upload01Icon} size={17} />

              {selectedFile || currentImage
                ? "Choose replacement"
                : "Choose image"}
            </label>
          </div>

          {selectedFile && (
            <p className={styles.fileName}>{selectedFile.name}</p>
          )}

          {removable && currentImage && !removed && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled}
              leftIcon={<Icon icon={Cancel01Icon} size={16} />}
              onClick={handleRemove}
            >
              Remove image
            </Button>
          )}

          {removed && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled}
              onClick={handleRestore}
            >
              Keep current image
            </Button>
          )}
        </div>
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
