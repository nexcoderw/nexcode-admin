export type ContactOrdering =
    | "created_at"
    | "-created_at"
    | "name"
    | "-name";

export type ContactStatus =
    | "new"
    | "replied";

export type ContactDeviceType =
    | "desktop"
    | "mobile"
    | "tablet"
    | "bot"
    | "unknown";

/**
 * A message sent through the public contact form, with the details the
 * backend recorded about who sent it.
 */
export interface Contact {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;

    ipAddress: string | null;
    userAgent: string | null;
    deviceType: ContactDeviceType;
    browser: string | null;
    operatingSystem: string | null;

    /**
     * When an administrator first replied; null while unanswered.
     */
    repliedAt: string | null;
    createdAt: string;
}

export interface ContactReplyInput {
    subject: string;
    message: string;
}

export interface ContactPagination {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface ContactListData {
    items: Contact[];
    pagination: ContactPagination;

    /**
     * Unanswered messages across the whole inbox, whatever the filters.
     */
    unanswered: number;
}

export interface ContactListQuery {
    search?: string;
    status?: ContactStatus;
    ordering?: ContactOrdering;
    page?: number;
    pageSize?: number;
}
