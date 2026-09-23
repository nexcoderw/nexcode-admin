import {
    readdirSync,
    readFileSync,
} from "node:fs";
import {
    join,
    relative,
} from "node:path";

import {
    describe,
    expect,
    it,
} from "vitest";

const DIALOG_IMPORT =
    "@/components/ui/Dialog/Dialog";

describe(
    "Portfolio dialog boundaries",
    () => {
        it(
            "uses Dialog only for filters and delete confirmation",
            () => {
                const roots = [
                    join(
                        process.cwd(),
                        "src/components/portfolio",
                    ),
                    join(
                        process.cwd(),
                        "src/app/(dashboard)/portfolios",
                    ),
                ];

                const matches =
                    roots
                        .flatMap(
                            collectTsxFiles,
                        )
                        .filter(
                            (file) =>
                                !file.endsWith(
                                    ".spec.tsx",
                                ),
                        )
                        .filter(
                            (file) =>
                                readFileSync(
                                    file,
                                    "utf8",
                                ).includes(
                                    DIALOG_IMPORT,
                                ),
                        )
                        .map(
                            (file) =>
                                relative(
                                    process.cwd(),
                                    file,
                                ).replaceAll(
                                    "\\",
                                    "/",
                                ),
                        )
                        .sort();

                expect(
                    matches,
                ).toEqual([
                    "src/components/portfolio/PortfolioDeleteAction/PortfolioDeleteAction.tsx",
                    "src/components/portfolio/PortfolioFiltersDialog/PortfolioFiltersDialog.tsx",
                ]);
            },
        );
    },
);

function collectTsxFiles(
    directory: string,
): string[] {
    return readdirSync(
        directory,
        {
            withFileTypes: true,
        },
    ).flatMap(
        (entry) => {
            const path =
                join(
                    directory,
                    entry.name,
                );

            if (
                entry.isDirectory()
            ) {
                return collectTsxFiles(
                    path,
                );
            }

            return entry.name.endsWith(
                ".tsx",
            )
                ? [path]
                : [];
        },
    );
}