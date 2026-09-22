import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { TeamMember } from "@/types/team/team";

import { TeamCard } from "./TeamCard";

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

  it("renders View and Edit using accessible actions", () => {
    render(<TeamCard member={member} />);

    expect(screen.getByRole("link", { name: "View Jane Doe" })).toHaveAttribute(
      "href",
      "/team/detail/17",
    );

    expect(screen.getByRole("link", { name: "Edit Jane Doe" })).toHaveAttribute(
      "href",
      "/team/edit/17",
    );
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
