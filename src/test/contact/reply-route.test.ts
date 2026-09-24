import { beforeEach, describe, expect, it, vi } from "vitest";

import { POST as replyRoute } from "@/app/api/contact/reply/[id]/route";
import { makeContact } from "@/test/contact/fixtures";
import { createClientRequest } from "@/test/client/request";

const mocks = vi.hoisted(() => ({
  replyToContact: vi.fn(),
  runContactMutation: vi.fn(),
}));

vi.mock("@/endpoints/contact/reply-contact", () => ({
  replyToContact: mocks.replyToContact,
}));

vi.mock("@/utils/contact/contact-mutation", () => ({
  runContactMutation: mocks.runContactMutation,
}));

function reply(id: string, options: Parameters<typeof createClientRequest>[1]) {
  return replyRoute(
    createClientRequest(`/api/contact/reply/${id}`, {
      method: "POST",
      ...options,
    }),
    { params: Promise.resolve({ id }) },
  );
}

const PAYLOAD = {
  subject: "Re: Project enquiry",
  message: "Thanks for reaching out.",
};

describe("Contact reply BFF route", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.runContactMutation.mockImplementation(
      async (
        _sessionId: string,
        _stored: string | null,
        _forwarded: Headers,
        mutation: (csrf: { cookie: string; token: string }) => Promise<unknown>,
      ) => mutation({ cookie: "csrf-cookie", token: "csrf-token" }),
    );
  });

  it("requires authentication", async () => {
    const response = await reply("7", { json: PAYLOAD, authenticated: false });

    expect(response.status).toBe(401);
    expect(mocks.replyToContact).not.toHaveBeenCalled();
  });

  it("rejects an invalid id or body before calling the backend", async () => {
    for (const [id, json] of [
      ["abc", PAYLOAD],
      ["0", PAYLOAD],
      ["7", { subject: "Only a subject" }],
      ["7", { subject: 1, message: "x" }],
    ] as const) {
      const response = await reply(id, { json });

      expect(response.status).toBe(400);
    }

    expect(mocks.replyToContact).not.toHaveBeenCalled();
  });

  it("forwards only the subject and message", async () => {
    mocks.replyToContact.mockResolvedValue({
      ok: true,
      status: 201,
      contact: makeContact({ repliedAt: "2026-09-24T10:00:00Z" }),
      fields: [],
    });

    const response = await reply("7", {
      json: { ...PAYLOAD, to: "someone-else@example.com" },
    });

    expect(response.status).toBe(201);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(mocks.replyToContact).toHaveBeenCalledWith(
      7,
      PAYLOAD,
      "django-session",
      { cookie: "csrf-cookie", token: "csrf-token" },
      expect.any(Headers),
    );
  });

  it("passes rejected fields back to the dialog", async () => {
    mocks.replyToContact.mockResolvedValue({
      ok: false,
      status: 400,
      contact: null,
      fields: ["subject"],
    });

    const response = await reply("7", { json: PAYLOAD });

    expect(response.status).toBe(400);
    expect((await response.json()).fields).toEqual(["subject"]);
  });

  it("reports an undelivered email separately", async () => {
    mocks.replyToContact.mockResolvedValue({
      ok: false,
      status: 502,
      contact: null,
      fields: [],
    });

    const response = await reply("7", { json: PAYLOAD });

    expect(response.status).toBe(502);
  });

  it("maps a missing message to not found", async () => {
    mocks.replyToContact.mockResolvedValue({
      ok: false,
      status: 404,
      contact: null,
      fields: [],
    });

    const response = await reply("7", { json: PAYLOAD });

    expect(response.status).toBe(404);
  });

  it("hides backend failures behind a service-unavailable response", async () => {
    mocks.replyToContact.mockRejectedValue(new Error("connection refused"));

    const response = await reply("7", { json: PAYLOAD });
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(JSON.stringify(body)).not.toContain("connection refused");
  });
});
