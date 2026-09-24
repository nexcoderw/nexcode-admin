import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  mapClient,
  mapClientListData,
} from "@/endpoints/client/mapper";
import {
  toBackendClientPayload,
} from "@/endpoints/client/payload";
import {
  getClientInitials,
  formatClientDate,
} from "@/utils/client/client-format";
import {
  parseClientId,
} from "@/utils/client/client-id";
import {
  sanitizeClientPayload,
} from "@/utils/client/client-json-payload";
import {
  parseClientListQuery,
} from "@/utils/client/client-list-query";
import {
  runClientMutation,
} from "@/utils/client/client-mutation";
import {
  buildClientListHref,
  resolveClientListQuery,
  toClientEndpointQuery,
} from "@/utils/client/client-page-query";

const mocks =
  vi.hoisted(() => ({
    getAdminCsrf:
      vi.fn(),
  }));

vi.mock(
  "@/endpoints/auth/get-csrf",
  () => ({
    getAdminCsrf:
      mocks.getAdminCsrf,
  }),
);

describe(
  "Client payload utilities",
  () => {
    it(
      "keeps only editable Client fields",
      () => {
        expect(
          sanitizeClientPayload({
            id: 99,

            name:
              "Acme Rwanda",

            email:
              "hello@acme.rw",

            phoneNumber:
              "+250 788 000 000",

            role:
              "administrator",

            createdAt:
              "forbidden",
          }),
        ).toEqual({
          name:
            "Acme Rwanda",

          email:
            "hello@acme.rw",

          phoneNumber:
            "+250 788 000 000",
        });
      },
    );

    it(
      "rejects known fields with invalid types",
      () => {
        expect(
          sanitizeClientPayload({
            name:
              "Acme Rwanda",

            email: 123,
          }),
        ).toBeNull();

        expect(
          sanitizeClientPayload(
            [],
          ),
        ).toBeNull();

        expect(
          sanitizeClientPayload(
            null,
          ),
        ).toBeNull();
      },
    );

    it(
      "preserves empty strings so optional fields can be cleared",
      () => {
        expect(
          sanitizeClientPayload({
            email: "",
            phoneNumber: "",
          }),
        ).toEqual({
          email: "",
          phoneNumber: "",
        });
      },
    );

    it(
      "translates the phone field to the Django field name",
      () => {
        expect(
          toBackendClientPayload({
            name:
              "Acme Rwanda",

            email:
              "hello@acme.rw",

            phoneNumber:
              "+250 788 000 000",
          }),
        ).toEqual({
          name:
            "Acme Rwanda",

          email:
            "hello@acme.rw",

          phone_number:
            "+250 788 000 000",
        });
      },
    );

    it(
      "omits fields that were not supplied",
      () => {
        expect(
          toBackendClientPayload({
            email: "",
          }),
        ).toEqual({
          email: "",
        });
      },
    );
  },
);

describe(
  "Client response mapping",
  () => {
    const backendClient = {
      id: 7,

      name:
        "Acme Rwanda",

      email:
        "hello@acme.rw",

      phone_number:
        "+250 788 000 000",

      created_at:
        "2026-09-20T10:00:00Z",

      updated_at:
        "2026-09-21T10:00:00Z",
    };

    it(
      "maps Django Client fields to admin fields",
      () => {
        expect(
          mapClient(
            backendClient,
          ),
        ).toEqual({
          id: 7,

          name:
            "Acme Rwanda",

          email:
            "hello@acme.rw",

          phoneNumber:
            "+250 788 000 000",

          createdAt:
            "2026-09-20T10:00:00Z",

          updatedAt:
            "2026-09-21T10:00:00Z",
        });
      },
    );

    it(
      "rejects malformed backend Client records",
      () => {
        expect(
          mapClient({
            ...backendClient,
            id: "7",
          }),
        ).toBeNull();

        expect(
          mapClient({
            ...backendClient,
            phone_number: 250788,
          }),
        ).toBeNull();

        expect(
          mapClient({
            name:
              "Incomplete",
          }),
        ).toBeNull();
      },
    );

    it(
      "maps a complete paginated Client response",
      () => {
        expect(
          mapClientListData(
            [
              backendClient,
            ],
            {
              page: 1,
              page_size: 12,
              total_items: 1,
              total_pages: 1,
              has_next: false,
              has_previous: false,
            },
          ),
        ).toEqual({
          items: [
            {
              id: 7,

              name:
                "Acme Rwanda",

              email:
                "hello@acme.rw",

              phoneNumber:
                "+250 788 000 000",

              createdAt:
                "2026-09-20T10:00:00Z",

              updatedAt:
                "2026-09-21T10:00:00Z",
            },
          ],

          pagination: {
            page: 1,
            pageSize: 12,
            totalItems: 1,
            totalPages: 1,
            hasNext: false,
            hasPrevious: false,
          },
        });
      },
    );

    it(
      "rejects a malformed pagination envelope",
      () => {
        expect(
          mapClientListData(
            [
              backendClient,
            ],
            {
              page: "1",
            },
          ),
        ).toBeNull();
      },
    );
  },
);

describe(
  "Client BFF query parsing",
  () => {
    it(
      "accepts valid list filters",
      () => {
        expect(
          parseClientListQuery(
            new URLSearchParams({
              search:
                "Acme",

              ordering:
                "name",

              page:
                "2",

              pageSize:
                "50",
            }),
          ),
        ).toEqual({
          search:
            "Acme",

          ordering:
            "name",

          page: 2,

          pageSize: 50,
        });
      },
    );

    it(
      "rejects invalid ordering",
      () => {
        expect(
          parseClientListQuery(
            new URLSearchParams({
              ordering:
                "email",
            }),
          ),
        ).toBeNull();
      },
    );

    it(
      "rejects invalid pagination",
      () => {
        expect(
          parseClientListQuery(
            new URLSearchParams({
              page:
                "0",
            }),
          ),
        ).toBeNull();

        expect(
          parseClientListQuery(
            new URLSearchParams({
              pageSize:
                "101",
            }),
          ),
        ).toBeNull();
      },
    );
  },
);

describe(
  "Client page query handling",
  () => {
    it(
      "normalizes search, ordering and page values",
      () => {
        const query =
          resolveClientListQuery({
            search:
              "  Acme Rwanda  ",

            ordering:
              "name",

            page:
              "3",
          });

        expect(
          query,
        ).toEqual({
          search:
            "Acme Rwanda",

          ordering:
            "name",

          page: 3,

          pageSize: 12,
        });

        expect(
          toClientEndpointQuery(
            query,
          ),
        ).toEqual({
          search:
            "Acme Rwanda",

          ordering:
            "name",

          page: 3,

          pageSize: 12,
        });
      },
    );

    it(
      "falls back safely from invalid query values",
      () => {
        expect(
          resolveClientListQuery({
            ordering:
              "email",

            page:
              "-5",
          }),
        ).toEqual({
          search: "",

          ordering:
            "-created_at",

          page: 1,

          pageSize: 12,
        });
      },
    );

    it(
      "builds a stable list URL",
      () => {
        const query =
          resolveClientListQuery({
            search:
              "Acme",

            ordering:
              "name",
          });

        expect(
          buildClientListHref(
            query,
            3,
          ),
        ).toBe(
          "/clients?search=Acme&ordering=name&page=3",
        );
      },
    );
  },
);

describe(
  "Client identifiers and presentation helpers",
  () => {
    it(
      "accepts only positive safe Client identifiers",
      () => {
        expect(
          parseClientId(
            "17",
          ),
        ).toBe(17);

        expect(
          parseClientId(
            "0",
          ),
        ).toBeNull();

        expect(
          parseClientId(
            "-1",
          ),
        ).toBeNull();

        expect(
          parseClientId(
            "../17",
          ),
        ).toBeNull();
      },
    );

    it(
      "creates at most two Client initials",
      () => {
        expect(
          getClientInitials(
            "Acme Rwanda",
          ),
        ).toBe("AR");

        expect(
          getClientInitials(
            "NEXCODE",
          ),
        ).toBe("N");

        expect(
          getClientInitials(
            "  ",
          ),
        ).toBe("?");
      },
    );

    it(
      "uses a safe fallback for invalid dates",
      () => {
        expect(
          formatClientDate(
            "not-a-date",
          ),
        ).toBe("—");
      },
    );
  },
);

describe(
  "Client CSRF mutations",
  () => {
    beforeEach(() => {
      mocks.getAdminCsrf
        .mockReset();
    });

    it(
      "reuses a stored CSRF token",
      async () => {
        const mutation =
          vi.fn()
            .mockResolvedValue({
              status: 200,
            });

        const result =
          await runClientMutation(
            "django-session",
            "stored-csrf",
            new Headers(),
            mutation,
          );

        expect(
          result,
        ).toEqual({
          status: 200,
        });

        expect(
          mutation,
        ).toHaveBeenCalledWith({
          cookie:
            "stored-csrf",

          token:
            "stored-csrf",
        });

        expect(
          mocks.getAdminCsrf,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "refreshes CSRF once after a forbidden mutation",
      async () => {
        mocks.getAdminCsrf
          .mockResolvedValue({
            cookie:
              "new-cookie",

            token:
              "new-token",
          });

        const mutation =
          vi.fn()
            .mockResolvedValueOnce({
              status: 403,
            })
            .mockResolvedValueOnce({
              status: 200,
            });

        const result =
          await runClientMutation(
            "django-session",
            "stored-csrf",
            new Headers(),
            mutation,
          );

        expect(
          result,
        ).toEqual({
          status: 200,
        });

        expect(
          mutation,
        ).toHaveBeenCalledTimes(
          2,
        );

        expect(
          mutation,
        ).toHaveBeenLastCalledWith({
          cookie:
            "new-cookie",

          token:
            "new-token",
        });

        expect(
          mocks.getAdminCsrf,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );

    it(
      "stops when no CSRF token can be obtained",
      async () => {
        mocks.getAdminCsrf
          .mockResolvedValue(
            null,
          );

        const mutation =
          vi.fn();

        const result =
          await runClientMutation(
            "django-session",
            null,
            new Headers(),
            mutation,
          );

        expect(
          result,
        ).toBeNull();

        expect(
          mutation,
        ).not.toHaveBeenCalled();
      },
    );
  },
);