import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  ClientDeleteAction,
} from "@/components/client/ClientDeleteAction/ClientDeleteAction";
import {
  ClientFiltersDialog,
} from "@/components/client/ClientFiltersDialog/ClientFiltersDialog";
import type {
  ResolvedClientListQuery,
} from "@/utils/client/client-page-query";

const replace =
  vi.fn();

const refresh =
  vi.fn();

vi.mock(
  "next/navigation",
  () => ({
    useRouter: () => ({
      replace,
      refresh,
    }),
  }),
);

const query:
  ResolvedClientListQuery = {
    search:
      "acme",

    ordering:
      "name",

    page: 1,

    pageSize: 12,
  };

describe(
  "Client filter dialog",
  () => {
    it(
      "opens with the active Client filters",
      async () => {
        const user =
          userEvent.setup();

        render(
          <ClientFiltersDialog
            query={query}
          />,
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                /Filters/,
            },
          ),
        );

        expect(
          screen.getByRole(
            "dialog",
            {
              name:
                "Filter clients",
            },
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByLabelText(
            "Search",
          ),
        ).toHaveValue(
          "acme",
        );

        expect(
          screen.getByLabelText(
            "Sort by",
          ),
        ).toHaveValue(
          "name",
        );

        expect(
          screen.getByRole(
            "link",
            {
              name:
                "Reset",
            },
          ),
        ).toHaveAttribute(
          "href",
          "/clients",
        );
      },
    );
  },
);

describe(
  "Client deletion dialog",
  () => {
    beforeEach(() => {
      replace.mockReset();
      refresh.mockReset();
    });

    it(
      "requires confirmation before deleting",
      async () => {
        const user =
          userEvent.setup();

        const fetchSpy =
          vi.spyOn(
            globalThis,
            "fetch",
          );

        render(
          <ClientDeleteAction
            clientId={7}
            name="Acme Rwanda"
          />,
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Delete Acme Rwanda",
            },
          ),
        );

        expect(
          screen.getByRole(
            "dialog",
            {
              name:
                "Delete Acme Rwanda?",
            },
          ),
        ).toBeInTheDocument();

        expect(
          fetchSpy,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "uses the dedicated Client delete BFF route",
      async () => {
        const user =
          userEvent.setup();

        const onDeleted =
          vi.fn();

        vi.spyOn(
          globalThis,
          "fetch",
        ).mockResolvedValue(
          new Response(
            JSON.stringify({
              success:
                true,
            }),
            {
              status: 200,
            },
          ),
        );

        render(
          <ClientDeleteAction
            clientId={7}
            name="Acme Rwanda"
            onDeleted={
              onDeleted
            }
          />,
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Delete Acme Rwanda",
            },
          ),
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Delete permanently",
            },
          ),
        );

        await waitFor(
          () => {
            expect(
              globalThis.fetch,
            ).toHaveBeenCalledWith(
              "/api/client/delete/7",

              expect.objectContaining({
                method:
                  "DELETE",
              }),
            );
          },
        );

        expect(
          onDeleted,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          refresh,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );

    it(
      "never renders raw upstream failure text",
      async () => {
        const user =
          userEvent.setup();

        vi.spyOn(
          globalThis,
          "fetch",
        ).mockResolvedValue(
          new Response(
            JSON.stringify({
              message:
                "Django database stack trace",
            }),
            {
              status: 503,
            },
          ),
        );

        render(
          <ClientDeleteAction
            clientId={7}
            name="Acme Rwanda"
          />,
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Delete Acme Rwanda",
            },
          ),
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Delete permanently",
            },
          ),
        );

        expect(
          await screen.findByText(
            "The client could not be deleted.",
          ),
        ).toBeInTheDocument();

        expect(
          screen.queryByText(
            "Django database stack trace",
          ),
        ).not.toBeInTheDocument();
      },
    );

    it(
      "redirects to login after an authentication failure",
      async () => {
        const user =
          userEvent.setup();

        vi.spyOn(
          globalThis,
          "fetch",
        ).mockResolvedValue(
          new Response(
            null,
            {
              status: 401,
            },
          ),
        );

        render(
          <ClientDeleteAction
            clientId={7}
            name="Acme Rwanda"
          />,
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Delete Acme Rwanda",
            },
          ),
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Delete permanently",
            },
          ),
        );

        await waitFor(
          () => {
            expect(
              replace,
            ).toHaveBeenCalledWith(
              "/login",
            );
          },
        );
      },
    );
  },
);