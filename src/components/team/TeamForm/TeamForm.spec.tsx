import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { TeamMember } from "@/types/team/team";

import { TeamForm } from "./TeamForm";

const push = vi.fn();
const replace = vi.fn();
const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
    replace,
    refresh,
  }),
}));

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt ?? ""} />
  ),
}));

const member: TeamMember = {
  id: 17,
  name: "Jane Doe",
  slug: "jane-doe",
  position: "Engineer",
  image: null,
  imagePng: null,
  linkedin: "https://linkedin.com/in/jane",
  github: "https://github.com/jane",
  createdAt: "2026-09-20T10:00:00Z",
  updatedAt: "2026-09-20T10:00:00Z",
};

describe("TeamForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    push.mockReset();
    replace.mockReset();
    refresh.mockReset();
  });

  it("validates required fields before sending an add request", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    render(<TeamForm mode="add" />);

    await userEvent.click(
      screen.getByRole("button", { name: "Add team member" }),
    );

    expect(
      screen.getByText("Enter the team member's name."),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Enter the team member's position."),
    ).toBeInTheDocument();

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("submits add fields as FormData and navigates to the returned member", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: {
            teamMember: member,
          },
        }),
        {
          status: 201,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    );

    render(<TeamForm mode="add" />);

    await userEvent.type(screen.getByLabelText(/Name/), "Jane Doe");

    await userEvent.type(screen.getByLabelText(/Position/), "Engineer");

    await userEvent.click(
      screen.getByRole("button", { name: "Add team member" }),
    );

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });

    const [url, options] = vi.mocked(globalThis.fetch).mock.calls[0];

    expect(url).toBe("/api/team/add");
    expect(options?.method).toBe("POST");
    expect(options?.body).toBeInstanceOf(FormData);

    const body = options?.body as FormData;

    expect(body.get("name")).toBe("Jane Doe");
    expect(body.get("position")).toBe("Engineer");

    expect(push).toHaveBeenCalledWith("/team");
    expect(refresh).toHaveBeenCalled();
  });

  it("submits image removal without a conflicting replacement", async () => {
    const memberWithImage: TeamMember = {
      ...member,
      image: "/media/team/images/jane-doe/profile.jpg",
    };

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: {
            teamMember: {
              ...memberWithImage,
              image: null,
            },
          },
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    );

    render(<TeamForm mode="edit" teamMember={memberWithImage} />);

    await userEvent.click(screen.getByRole("button", { name: "Remove image" }));

    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });

    const [, options] = vi.mocked(globalThis.fetch).mock.calls[0];

    expect(options?.method).toBe("PATCH");

    const body = options?.body as FormData;

    expect(body.get("remove_image")).toBe("true");
    expect(body.get("image")).toBeNull();

    expect(push).toHaveBeenCalledWith("/team");
  });

  it("maps stable backend fields without displaying raw backend errors", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: false,
          fields: ["linkedin"],
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    );

    render(<TeamForm mode="add" />);

    await userEvent.type(screen.getByLabelText(/Name/), "Jane");
    await userEvent.type(screen.getByLabelText(/Position/), "Engineer");

    await userEvent.click(
      screen.getByRole("button", { name: "Add team member" }),
    );

    expect(
      await screen.findByText("Enter a valid LinkedIn URL."),
    ).toBeInTheDocument();
  });

  it("rejects a non-PNG cutout before submission", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    render(<TeamForm mode="add" />);

    await userEvent.type(screen.getByLabelText(/Name/), "Jane");
    await userEvent.type(screen.getByLabelText(/Position/), "Engineer");

    const cutout = new File(["not-png"], "cutout.jpg", { type: "image/jpeg" });

    fireEvent.change(screen.getByLabelText("Transparent PNG / cutout"), {
      target: {
        files: [cutout],
      },
    });

    await userEvent.click(
      screen.getByRole("button", { name: "Add team member" }),
    );

    expect(
      screen.getByText("The cutout image must be a PNG file."),
    ).toBeInTheDocument();

    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
