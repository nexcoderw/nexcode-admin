import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";

import type { TeamMember } from "@/types/team/team";

import { TeamCard } from "./TeamCard";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("next/image", () => ({
  default: (
    props: React.ImgHTMLAttributes<HTMLImageElement> & {
      fill?: boolean;
      unoptimized?: boolean;
    },
  ) => {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={props.src}
        alt={props.alt ?? ""}
        className={props.className}
        sizes={props.sizes}
      />
    );
  },
}));

const member: TeamMember = {
  id: 17,
  name: "Jane Doe",
  slug: "jane-doe",
  position: "Engineer",
  image: "/media/team/images/jane-doe/profile.jpg",
  imagePng: "/media/team/png/jane-doe/cutout.png",
  linkedin: "https://linkedin.com/in/jane",
  github: null,
  createdAt: "2026-09-20T10:00:00Z",
  updatedAt: "2026-09-20T10:00:00Z",
};

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute("open", "");
  };

  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute("open");
  };
});

describe("TeamCard", () => {
  it("renders the standard non-transparent profile image", () => {
    render(<TeamCard member={member} />);

    const portrait = screen.getByRole("img", {
      name: "Jane Doe profile portrait",
    });

    expect(portrait).toHaveAttribute(
      "src",
      "/api/team/media?path=%2Fmedia%2Fteam%2Fimages%2Fjane-doe%2Fprofile.jpg",
    );

    expect(portrait.getAttribute("src")).not.toContain("cutout.png");
  });

  it("opens member details in a dialog and keeps editing available", async () => {
    render(<TeamCard member={member} />);

    expect(
      screen.queryByRole("link", { name: "View Jane Doe" }),
    ).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: "View Jane Doe" }),
    );

    expect(
      screen.getByRole("dialog", { name: "Jane Doe" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Profile information")).toBeInTheDocument();

    expect(
      screen.queryByRole("link", { name: "Edit Jane Doe" }),
    ).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Edit profile" }));

    expect(
      screen.getByRole("dialog", { name: "Edit Jane Doe" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Save changes" }),
    ).toBeInTheDocument();
  });

  it("shows only professional profiles that exist", () => {
    render(<TeamCard member={member} />);

    expect(
      screen.getByRole("link", { name: "Jane Doe on LinkedIn" }),
    ).toHaveAttribute("href", member.linkedin);

    expect(
      screen.queryByRole("link", { name: "Jane Doe on GitHub" }),
    ).not.toBeInTheDocument();
  });

  it("does not use the transparent image as a fallback", () => {
    render(<TeamCard member={{ ...member, image: null }} />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();

    expect(screen.getByText("Profile image unavailable")).toBeInTheDocument();
  });
});
