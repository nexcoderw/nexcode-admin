import {
    CONTACT_DEVICE_LABELS,
} from "@/constants/contact/contact-options";
import type {
    Contact,
} from "@/types/contact/contact";


/*
 * The table renders on the server, whose clock is usually UTC. Times are
 * shown in Kigali time, where the team reads them.
 */
const TIME_ZONE = "Africa/Kigali";

const DATE_FORMAT =
    new Intl.DateTimeFormat(
        "en",
        {
            timeZone: TIME_ZONE,
            day: "numeric",
            month: "short",
            year: "numeric",
        },
    );

const TIME_FORMAT =
    new Intl.DateTimeFormat(
        "en",
        {
            timeZone: TIME_ZONE,
            hour: "2-digit",
            minute: "2-digit",
        },
    );


/**
 * The date and time a message arrived, as separate lines for the table.
 */
export function formatContactDate(
    value: string,
) {
    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime(),
        )
    ) {
        return {
            date: "—",
            time: "",
        };
    }

    return {
        date:
            DATE_FORMAT.format(date),
        time:
            TIME_FORMAT.format(date),
    };
}

/**
 * "Chrome on Windows", or as much of it as the backend recognised.
 */
export function describeContactDevice(
    contact: Pick<
        Contact,
        | "browser"
        | "operatingSystem"
        | "deviceType"
    >,
) {
    const {
        browser,
        operatingSystem,
    } = contact;

    if (browser && operatingSystem) {
        return `${browser} on ${operatingSystem}`;
    }

    return (
        browser ??
        operatingSystem ??
        CONTACT_DEVICE_LABELS[
            contact.deviceType
        ]
    );
}

/**
 * The subject a reply starts with: the sender's own, marked as a reply
 * once, so answering "Re: Hello" does not produce "Re: Re: Hello".
 */
export function replySubject(
    subject: string,
) {
    const trimmed =
        subject.trim();

    return /^re:/i.test(trimmed)
        ? trimmed
        : `Re: ${trimmed}`;
}

export function getContactInitials(
    name: string,
) {
    const initials = name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(
            (part) =>
                part[0]?.toUpperCase() ??
                "",
        )
        .join("");

    return initials || "?";
}
