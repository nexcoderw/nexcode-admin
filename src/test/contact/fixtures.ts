import type { Contact } from "@/types/contact/contact";

export function makeContact(overrides: Partial<Contact> = {}): Contact {
  return {
    id: 7,
    name: "Jane Doe",
    email: "jane@example.com",
    subject: "Project enquiry",
    message: "I would like to discuss a project.",
    ipAddress: "203.0.113.9",
    userAgent: "Mozilla/5.0",
    deviceType: "desktop",
    browser: "Chrome",
    operatingSystem: "Windows",
    repliedAt: null,
    createdAt: "2026-09-24T08:30:00Z",
    ...overrides,
  };
}
