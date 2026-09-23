import { AUTH_MESSAGES } from "@/constants/messages/auth-messages";
import { CLIENT_MESSAGES } from "@/constants/messages/client-messages";
import { COMMON_MESSAGES } from "@/constants/messages/common-messages";
import { PORTFOLIO_MESSAGES } from "@/constants/messages/portfolio-messages";
import { TEAM_MESSAGES } from "@/constants/messages/team-messages";

/**
 * Every message the admin can display, keyed by message key.
 *
 * Used where the key's feature is not known in advance — resolving a key
 * returned by an API route, for instance. Code that knows which feature
 * it belongs to imports that feature's keys directly instead.
 *
 * Keys are namespaced by feature ("auth.…", "team.…"), so combining the
 * feature maps can never overwrite one message with another.
 */
export const MESSAGES = {
    ...AUTH_MESSAGES,
    ...COMMON_MESSAGES,
    ...TEAM_MESSAGES,
    ...PORTFOLIO_MESSAGES,
    ...CLIENT_MESSAGES,
} as const;

export type MessageKey =
    keyof typeof MESSAGES;
