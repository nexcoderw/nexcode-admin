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
  ClientForm,
} from "@/components/client/ClientForm/ClientForm";
import {
  makeClient,
} from "@/test/client/fixtures";

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

describe(
  "ClientForm",
  () => {
    beforeEach(() => {
      replace.mockReset();
      refresh.mockReset();
    });

    it(
      "creates a Client through the Client BFF",
      async () => {
        const user =
          userEvent.setup();

        const onSaved =
          vi.fn();

        vi.spyOn(
          globalThis,
          "fetch",
        ).mockResolvedValue(
          new Response(
            null,
            {
              status: 201,
            },
          ),
        );

        render(
          <ClientForm
            mode="add"
            onCancel={
              vi.fn()
            }
            onSaved={
              onSaved
            }
          />,
        );

        await user.type(
          screen.getByLabelText(
            /^Name/,
          ),
          "  Acme Rwanda  ",
        );

        await user.type(
          screen.getByLabelText(
            "Email",
          ),
          "  hello@acme.rw  ",
        );

        await user.type(
          screen.getByLabelText(
            "Phone number",
          ),
          "  +250 788 000 000  ",
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Add client",
            },
          ),
        );

        await waitFor(
          () => {
            expect(
              globalThis.fetch,
            ).toHaveBeenCalledTimes(
              1,
            );
          },
        );

        const [
          url,
          options,
        ] =
          vi.mocked(
            globalThis.fetch,
          ).mock.calls[0];

        expect(
          url,
        ).toBe(
          "/api/client/add",
        );

        expect(
          options?.method,
        ).toBe(
          "POST",
        );

        expect(
          JSON.parse(
            String(
              options?.body,
            ),
          ),
        ).toEqual({
          name:
            "Acme Rwanda",

          email:
            "hello@acme.rw",

          phoneNumber:
            "+250 788 000 000",
        });

        expect(
          onSaved,
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
      "rejects an empty Client name before making a request",
      async () => {
        const user =
          userEvent.setup();

        const fetchSpy =
          vi.spyOn(
            globalThis,
            "fetch",
          );

        render(
          <ClientForm
            mode="add"
            onCancel={
              vi.fn()
            }
            onSaved={
              vi.fn()
            }
          />,
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Add client",
            },
          ),
        );

        expect(
          fetchSpy,
        ).not.toHaveBeenCalled();

        expect(
          screen.getByLabelText(
            /^Name/,
          ),
        ).toHaveAttribute(
          "aria-invalid",
          "true",
        );
      },
    );

    it(
      "updates an existing Client through PATCH",
      async () => {
        const user =
          userEvent.setup();

        const client =
          makeClient();

        vi.spyOn(
          globalThis,
          "fetch",
        ).mockResolvedValue(
          new Response(
            null,
            {
              status: 200,
            },
          ),
        );

        render(
          <ClientForm
            mode="edit"
            client={
              client
            }
            onCancel={
              vi.fn()
            }
            onSaved={
              vi.fn()
            }
          />,
        );

        const phone =
          screen.getByLabelText(
            "Phone number",
          );

        await user.clear(
          phone,
        );

        await user.type(
          phone,
          "+250 722 000 000",
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Save changes",
            },
          ),
        );

        await waitFor(
          () => {
            expect(
              globalThis.fetch,
            ).toHaveBeenCalledWith(
              "/api/client/update/7",

              expect.objectContaining({
                method:
                  "PATCH",
              }),
            );
          },
        );
      },
    );

    it(
      "maps backend validation fields to the matching control",
      async () => {
        const user =
          userEvent.setup();

        vi.spyOn(
          globalThis,
          "fetch",
        ).mockResolvedValue(
          new Response(
            JSON.stringify({
              success:
                false,

              fields: [
                "phoneNumber",
              ],
            }),
            {
              status: 400,

              headers: {
                "Content-Type":
                  "application/json",
              },
            },
          ),
        );

        render(
          <ClientForm
            mode="edit"
            client={
              makeClient()
            }
            onCancel={
              vi.fn()
            }
            onSaved={
              vi.fn()
            }
          />,
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Save changes",
            },
          ),
        );

        await waitFor(
          () => {
            expect(
              screen.getByLabelText(
                "Phone number",
              ),
            ).toHaveAttribute(
              "aria-invalid",
              "true",
            );
          },
        );

        expect(
          screen.getByText(
            "Check the highlighted fields and try again.",
          ),
        ).toBeInTheDocument();
      },
    );

    it(
      "clears a field error when that field is edited",
      async () => {
        const user =
          userEvent.setup();

        vi.spyOn(
          globalThis,
          "fetch",
        ).mockResolvedValue(
          new Response(
            JSON.stringify({
              fields: [
                "email",
              ],
            }),
            {
              status: 400,

              headers: {
                "Content-Type":
                  "application/json",
              },
            },
          ),
        );

        render(
          <ClientForm
            mode="edit"
            client={
              makeClient()
            }
            onCancel={
              vi.fn()
            }
            onSaved={
              vi.fn()
            }
          />,
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Save changes",
            },
          ),
        );

        const email =
          screen.getByLabelText(
            "Email",
          );

        await waitFor(
          () => {
            expect(
              email,
            ).toHaveAttribute(
              "aria-invalid",
              "true",
            );
          },
        );

        await user.type(
          email,
          "x",
        );

        expect(
          email,
        ).not.toHaveAttribute(
          "aria-invalid",
          "true",
        );
      },
    );

    it(
      "redirects to login when the Client mutation session is unavailable",
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
          <ClientForm
            mode="edit"
            client={
              makeClient()
            }
            onCancel={
              vi.fn()
            }
            onSaved={
              vi.fn()
            }
          />,
        );

        await user.click(
          screen.getByRole(
            "button",
            {
              name:
                "Save changes",
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