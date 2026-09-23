import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PortfolioDocumentManager } from "@/components/portfolio/PortfolioDocumentManager/PortfolioDocumentManager";
import { PortfolioImageManager } from "@/components/portfolio/PortfolioImageManager/PortfolioImageManager";
import { PortfolioRepositoryManager } from "@/components/portfolio/PortfolioRepositoryManager/PortfolioRepositoryManager";
import { makePortfolioDetail } from "@/test/portfolio/fixtures";

const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: vi.fn(),
    refresh,
  }),
}));

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt ?? ""} />
  ),
}));

describe("Portfolio related record managers", () => {
  beforeEach(() => {
    refresh.mockReset();
  });

  it("adds images using multipart FormData", async () => {
    const user = userEvent.setup();

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
        }),
        {
          status: 201,
        },
      ),
    );

    render(<PortfolioImageManager portfolioId={7} images={[]} />);

    const imageInput = screen.getByLabelText(/^Image/);

    await user.upload(
      imageInput,
      new File(["image"], "dashboard.png", {
        type: "image/png",
      }),
    );

    expect(imageInput).toHaveProperty("files.length", 1);

    await user.type(screen.getByLabelText("Alt text"), "Dashboard");

    fireEvent.submit(imageInput.closest("form")!);

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });

    const [url, options] = vi.mocked(globalThis.fetch).mock.calls[0];

    expect(url).toBe("/api/portfolio/image/add/7");

    expect(options?.body).toBeInstanceOf(FormData);
  });

  it("adds documents only as title and URL", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
        }),
        {
          status: 201,
        },
      ),
    );

    render(<PortfolioDocumentManager portfolioId={7} documents={[]} />);

    expect(screen.queryByLabelText(/file/i)).not.toBeInTheDocument();

    await userEvent.type(
      screen.getByLabelText(/^Document title/),
      "Architecture",
    );

    await userEvent.type(
      screen.getByLabelText(/^Document URL/),
      "https://example.com/architecture",
    );

    await userEvent.click(
      screen.getByRole("button", {
        name: "Add document",
      }),
    );

    await waitFor(() => {
      const [url, options] = vi.mocked(globalThis.fetch).mock.calls[0];

      expect(url).toBe("/api/portfolio/document/add/7");

      expect(JSON.parse(String(options?.body))).toEqual({
        title: "Architecture",
        url: "https://example.com/architecture",
      });
    });
  });

  it("updates repository links inline without a dialog", async () => {
    const repository = makePortfolioDetail().repositories[0];

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
        }),
        {
          status: 200,
        },
      ),
    );

    render(
      <PortfolioRepositoryManager
        portfolioId={7}
        repositories={[repository]}
      />,
    );

    const label = screen.getByLabelText(/^Label/);

    await userEvent.clear(label);

    await userEvent.type(label, "GitLab");

    await userEvent.click(
      screen.getByRole("button", {
        name: "Save",
      }),
    );

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/portfolio/repository/update/31",
        expect.objectContaining({
          method: "PATCH",
        }),
      );
    });

    expect(
      screen.queryByRole("dialog", {
        name: /repository/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("rejects an existing repository link before submitting", async () => {
    const repository = makePortfolioDetail().repositories[0];
    const fetchMock = vi.spyOn(globalThis, "fetch");

    render(
      <PortfolioRepositoryManager
        portfolioId={7}
        repositories={[repository]}
      />,
    );

    await userEvent.type(
      screen.getByLabelText(/^Repository label/),
      "Duplicate",
    );

    await userEvent.type(
      screen.getByLabelText(/^Repository URL/),
      repository.url,
    );

    await userEvent.click(
      screen.getByRole("button", {
        name: "Add repository",
      }),
    );

    expect(
      screen.getByText(
        "This repository link already exists for this portfolio.",
      ),
    ).toBeInTheDocument();

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("explains repository URL validation failures", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 400 }),
    );

    render(<PortfolioRepositoryManager portfolioId={7} repositories={[]} />);

    await userEvent.type(
      screen.getByLabelText(/^Repository label/),
      "GitHub",
    );

    await userEvent.type(
      screen.getByLabelText(/^Repository URL/),
      "https://github.com/nexcode/api",
    );

    await userEvent.click(
      screen.getByRole("button", {
        name: "Add repository",
      }),
    );

    expect(
      await screen.findByText(
        "This repository URL is invalid or already exists for this portfolio.",
      ),
    ).toBeInTheDocument();
  });
});
