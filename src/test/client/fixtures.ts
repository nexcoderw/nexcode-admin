import type {
    Client,
} from "@/types/client/client";

export const CLIENT_ID = 7;

export function makeClient(
    overrides:
        Partial<Client> = {},
): Client {
    return {
        id: CLIENT_ID,
        name: "Acme Rwanda",
        email:
            "hello@acme.rw",
        phoneNumber:
            "+250 788 000 000",
        createdAt:
            "2026-09-20T10:00:00Z",
        updatedAt:
            "2026-09-21T10:00:00Z",
        ...overrides,
    };
}
