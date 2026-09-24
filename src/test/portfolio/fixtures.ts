import type {
    PortfolioDetail,
    PortfolioSummary,
} from "@/types/portfolio/portfolio";
import type {
    TeamMember,
} from "@/types/team/team";

export const PORTFOLIO_ID = 7;

export function makePortfolioSummary(
    overrides:
        Partial<PortfolioSummary> = {},
): PortfolioSummary {
    return {
        id: PORTFOLIO_ID,
        name: "NEXCODE Admin",
        slug: "nexcode-admin",
        summary:
            "Administration platform",
        category:
            "web_application",
        projectType:
            "client_project",
        status: "published",
        coverImage: {
            id: 3,
            image:
                "/media/portfolios/nexcode-admin/images/cover.jpg",
            altText:
                "NEXCODE Admin dashboard",
            isCover: true,
            position: 0,
            createdAt:
                "2026-09-20T10:00:00Z",
            updatedAt:
                "2026-09-20T10:00:00Z",
        },
        teamMemberCount: 1,
        projectInitiationDate:
            "2026-09-01",
        deadlineDate:
            "2026-10-01",
        publishedAt:
            "2026-09-20T10:00:00Z",
        createdAt:
            "2026-09-20T10:00:00Z",
        updatedAt:
            "2026-09-21T10:00:00Z",
        ...overrides,
    };
}

export function makePortfolioDetail(
    overrides:
        Partial<PortfolioDetail> = {},
): PortfolioDetail {
    return {
        id: PORTFOLIO_ID,
        name: "NEXCODE Admin",
        slug: "nexcode-admin",
        summary:
            "Administration platform",
        description:
            "Internal NEXCODE administration platform.",
        category:
            "web_application",
        projectType:
            "client_project",
        status: "published",
        liveUrl:
            "https://admin.nexcode.africa",
        figmaUrl:
            "https://figma.com/example",
        projectInitiationDate:
            "2026-09-01",
        deadlineDate:
            "2026-10-01",
        publishedAt:
            "2026-09-20T10:00:00Z",
        teamMembers: [
            {
                id: 17,
                name: "Jane Doe",
                slug: "jane-doe",
                position: "Engineer",
                image: null,
            },
        ],
        images: [
            {
                id: 3,
                image:
                    "/media/portfolios/nexcode-admin/images/cover.jpg",
                altText:
                    "Dashboard",
                isCover: true,
                position: 0,
                createdAt:
                    "2026-09-20T10:00:00Z",
                updatedAt:
                    "2026-09-20T10:00:00Z",
            },
        ],
        documents: [
            {
                id: 21,
                title:
                    "Project proposal",
                url:
                    "https://example.com/proposal",
                createdAt:
                    "2026-09-20T10:00:00Z",
                updatedAt:
                    "2026-09-20T10:00:00Z",
            },
        ],
        repositories: [
            {
                id: 31,
                label: "GitHub",
                url:
                    "https://github.com/nexcoderw/example",
                createdAt:
                    "2026-09-20T10:00:00Z",
                updatedAt:
                    "2026-09-20T10:00:00Z",
            },
        ],
        createdAt:
            "2026-09-20T10:00:00Z",
        updatedAt:
            "2026-09-21T10:00:00Z",
        ...overrides,
    };
}

export function makeTeamMember(
    overrides:
        Partial<TeamMember> = {},
): TeamMember {
    return {
        id: 17,
        name: "Jane Doe",
        slug: "jane-doe",
        position: "Engineer",
        image: null,
        imagePng: null,
        linkedin: null,
        github: null,
        displayOrder: 1,
        createdAt:
            "2026-09-20T10:00:00Z",
        updatedAt:
            "2026-09-20T10:00:00Z",
        ...overrides,
    };
}