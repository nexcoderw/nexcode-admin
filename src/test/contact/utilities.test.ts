import { describe, expect, it } from "vitest";

import { makeContact } from "@/test/contact/fixtures";
import {
  describeContactDevice,
  formatContactDate,
  replySubject,
} from "@/utils/contact/contact-format";
import {
  buildContactListHref,
  resolveContactListQuery,
  toContactEndpointQuery,
} from "@/utils/contact/contact-page-query";
import { sanitizeContactReplyPayload } from "@/utils/contact/contact-reply-payload";

describe("replySubject", () => {
  it("marks the sender's subject as a reply once", () => {
    expect(replySubject("Project enquiry")).toBe("Re: Project enquiry");
    expect(replySubject("RE: Project enquiry")).toBe("RE: Project enquiry");
    expect(replySubject("  Hello  ")).toBe("Re: Hello");
  });
});

describe("describeContactDevice", () => {
  it("combines browser and operating system", () => {
    expect(describeContactDevice(makeContact())).toBe("Chrome on Windows");
  });

  it("falls back to what is known", () => {
    expect(
      describeContactDevice(makeContact({ operatingSystem: null })),
    ).toBe("Chrome");

    expect(
      describeContactDevice(
        makeContact({ browser: null, operatingSystem: null, deviceType: "bot" }),
      ),
    ).toBe("Bot");
  });
});

describe("formatContactDate", () => {
  it("shows Kigali time", () => {
    // 08:30 UTC is 10:30 in Kigali (UTC+2).
    expect(formatContactDate("2026-09-24T08:30:00Z")).toEqual({
      date: "Sep 24, 2026",
      time: "10:30 AM",
    });
  });

  it("tolerates an invalid date", () => {
    expect(formatContactDate("not-a-date").date).toBe("—");
  });
});

describe("contact page query", () => {
  it("replaces invalid values with defaults", () => {
    expect(
      resolveContactListQuery({
        status: "spam",
        ordering: "ip_address",
        page: "-2",
      }),
    ).toEqual({
      search: "",
      status: "",
      ordering: "-created_at",
      page: 1,
      pageSize: 15,
    });
  });

  it("keeps valid filters in the endpoint query and links", () => {
    const query = resolveContactListQuery({
      search: " jane ",
      status: "new",
      ordering: "name",
    });

    expect(toContactEndpointQuery(query)).toMatchObject({
      search: "jane",
      status: "new",
      ordering: "name",
    });

    expect(buildContactListHref(query, 2)).toBe(
      "/contacts?search=jane&status=new&ordering=name&page=2",
    );
  });
});

describe("sanitizeContactReplyPayload", () => {
  it("keeps only the subject and message", () => {
    expect(
      sanitizeContactReplyPayload({
        subject: "Re: Hi",
        message: "Hello",
        to: "attacker@example.com",
      }),
    ).toEqual({ subject: "Re: Hi", message: "Hello" });
  });

  it("rejects bodies without both strings", () => {
    expect(sanitizeContactReplyPayload(null)).toBeNull();
    expect(sanitizeContactReplyPayload([])).toBeNull();
    expect(sanitizeContactReplyPayload({ subject: "Hi" })).toBeNull();
  });
});
