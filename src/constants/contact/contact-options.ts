import type {
    ContactDeviceType,
    ContactOrdering,
    ContactStatus,
} from "@/types/contact/contact";


export const CONTACT_ORDERINGS = [
    "-created_at",
    "created_at",
    "name",
    "-name",
] as const satisfies readonly ContactOrdering[];

export const CONTACT_STATUSES = [
    "new",
    "replied",
] as const satisfies readonly ContactStatus[];

export const CONTACT_DEVICE_TYPES = [
    "desktop",
    "mobile",
    "tablet",
    "bot",
    "unknown",
] as const satisfies readonly ContactDeviceType[];

export const CONTACT_DEVICE_LABELS: Record<
    ContactDeviceType,
    string
> = {
    desktop: "Desktop",
    mobile: "Mobile",
    tablet: "Tablet",
    bot: "Bot",
    unknown: "Unknown device",
};
