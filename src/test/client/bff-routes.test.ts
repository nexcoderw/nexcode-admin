import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  POST as addClientRoute,
} from "@/app/api/client/add/route";
import {
  DELETE as deleteClientRoute,
} from "@/app/api/client/delete/[id]/route";
import {
  GET as listClientRoute,
} from "@/app/api/client/list/route";
import {
  PATCH as updateClientRoute,
} from "@/app/api/client/update/[id]/route";
import {
  makeClient,
} from "@/test/client/fixtures";
import {
  createClientRequest,
} from "@/test/client/request";

const mocks =
  vi.hoisted(() => ({
    listClients:
      vi.fn(),

    addClient:
      vi.fn(),

    editClient:
      vi.fn(),

    deleteClient:
      vi.fn(),

    runClientMutation:
      vi.fn(),
  }));

vi.mock(
  "@/endpoints/client/list-clients",
  () => ({
    listClients:
      mocks.listClients,
  }),
);

vi.mock(
  "@/endpoints/client/add-client",
  () => ({
    addClient:
      mocks.addClient,
  }),
);

vi.mock(
  "@/endpoints/client/edit-client",
  () => ({
    editClient:
      mocks.editClient,
  }),
);

vi.mock(
  "@/endpoints/client/delete-client",
  () => ({
    deleteClient:
      mocks.deleteClient,
  }),
);

vi.mock(
  "@/utils/client/client-mutation",
  () => ({
    runClientMutation:
      mocks.runClientMutation,
  }),
);

describe(
  "Client BFF routes",
  () => {
    beforeEach(() => {
      mocks.runClientMutation
        .mockImplementation(
          async (
            _sessionId:
              string,

            _stored:
              string | null,

            _forwarded:
              Headers,

            mutation:
              (
                csrf: {
                  cookie: string;
                  token: string;
                },
              ) =>
                Promise<unknown>,
          ) =>
            mutation({
              cookie:
                "csrf-cookie",

              token:
                "csrf-token",
            }),
        );
    });

    it(
      "requires authentication for Client listing",
      async () => {
        const response =
          await listClientRoute(
            createClientRequest(
              "/api/client/list",
              {
                authenticated:
                  false,
              },
            ),
          );

        expect(
          response.status,
        ).toBe(401);

        expect(
          mocks.listClients,
        ).not.toHaveBeenCalled();

        expect(
          response.headers.get(
            "Cache-Control",
          ),
        ).toBe(
          "no-store",
        );
      },
    );

    it(
      "forwards validated Client list queries",
      async () => {
        mocks.listClients
          .mockResolvedValue({
            ok: true,

            status: 200,

            data: {
              items: [
                makeClient(),
              ],

              pagination: {
                page: 2,
                pageSize: 20,
                totalItems: 21,
                totalPages: 2,
                hasNext: false,
                hasPrevious: true,
              },
            },
          });

        const response =
          await listClientRoute(
            createClientRequest(
              "/api/client/list?search=Acme&ordering=name&page=2&pageSize=20",
            ),
          );

        expect(
          response.status,
        ).toBe(200);

        expect(
          mocks.listClients,
        ).toHaveBeenCalledWith(
          "django-session",

          expect.any(
            Headers,
          ),

          {
            search:
              "Acme",

            ordering:
              "name",

            page: 2,

            pageSize: 20,
          },
        );

        expect(
          await response.json(),
        ).toEqual({
          success: true,

          data: {
            items: [
              makeClient(),
            ],

            pagination: {
              page: 2,
              pageSize: 20,
              totalItems: 21,
              totalPages: 2,
              hasNext: false,
              hasPrevious: true,
            },
          },
        });
      },
    );

    it(
      "rejects invalid Client list ordering before calling Django",
      async () => {
        const response =
          await listClientRoute(
            createClientRequest(
              "/api/client/list?ordering=email",
            ),
          );

        expect(
          response.status,
        ).toBe(400);

        expect(
          mocks.listClients,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "narrows a Client creation payload before forwarding",
      async () => {
        mocks.addClient
          .mockResolvedValue({
            ok: true,

            status: 201,

            client:
              makeClient(),

            fields: [],
          });

        const response =
          await addClientRoute(
            createClientRequest(
              "/api/client/add",
              {
                method:
                  "POST",

                json: {
                  id: 999,

                  name:
                    "Acme Rwanda",

                  email:
                    "hello@acme.rw",

                  phoneNumber:
                    "+250 788 000 000",

                  isAdmin:
                    true,
                },
              },
            ),
          );

        expect(
          response.status,
        ).toBe(201);

        expect(
          mocks.addClient,
        ).toHaveBeenCalledWith(
          {
            name:
              "Acme Rwanda",

            email:
              "hello@acme.rw",

            phoneNumber:
              "+250 788 000 000",
          },

          "django-session",

          {
            cookie:
              "csrf-cookie",

            token:
              "csrf-token",
          },

          expect.any(
            Headers,
          ),
        );
      },
    );

    it(
      "rejects malformed Client creation JSON",
      async () => {
        const response =
          await addClientRoute(
            createClientRequest(
              "/api/client/add",
              {
                method:
                  "POST",

                json: {
                  name: 123,
                },
              },
            ),
          );

        expect(
          response.status,
        ).toBe(400);

        expect(
          mocks.runClientMutation,
        ).not.toHaveBeenCalled();

        expect(
          mocks.addClient,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "rejects an invalid Client update identifier",
      async () => {
        const response =
          await updateClientRoute(
            createClientRequest(
              "/api/client/update/invalid",
              {
                method:
                  "PATCH",

                json: {
                  name:
                    "Acme",
                },
              },
            ),

            {
              params:
                Promise.resolve({
                  id:
                    "../7",
                }),
            },
          );

        expect(
          response.status,
        ).toBe(400);

        expect(
          mocks.editClient,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "preserves Client not-found status during editing",
      async () => {
        mocks.editClient
          .mockResolvedValue({
            ok: false,

            status: 404,

            client: null,

            fields: [],
          });

        const response =
          await updateClientRoute(
            createClientRequest(
              "/api/client/update/7",
              {
                method:
                  "PATCH",

                json: {
                  name:
                    "Updated Client",
                },
              },
            ),

            {
              params:
                Promise.resolve({
                  id: "7",
                }),
            },
          );

        expect(
          response.status,
        ).toBe(404);

        const body =
          await response.json();

        expect(
          body.success,
        ).toBe(false);

        expect(
          body,
        ).not.toHaveProperty(
          "message",
        );
      },
    );

    it(
      "preserves Client not-found status during deletion",
      async () => {
        mocks.deleteClient
          .mockResolvedValue({
            ok: false,

            status: 404,
          });

        const response =
          await deleteClientRoute(
            createClientRequest(
              "/api/client/delete/7",
              {
                method:
                  "DELETE",
              },
            ),

            {
              params:
                Promise.resolve({
                  id: "7",
                }),
            },
          );

        expect(
          response.status,
        ).toBe(404);
      },
    );

    it(
      "returns a narrowed service failure instead of backend details",
      async () => {
        mocks.listClients
          .mockResolvedValue({
            ok: false,

            status: 500,

            data: null,

            message:
              "Database connection failed",
          });

        const response =
          await listClientRoute(
            createClientRequest(
              "/api/client/list",
            ),
          );

        expect(
          response.status,
        ).toBe(503);

        const body =
          await response.json();

        expect(
          body.success,
        ).toBe(false);

        expect(
          body,
        ).not.toHaveProperty(
          "message",
        );

        expect(
          JSON.stringify(
            body,
          ),
        ).not.toContain(
          "Database connection failed",
        );

        expect(
          response.headers.get(
            "Cache-Control",
          ),
        ).toBe(
          "no-store",
        );
      },
    );
  },
);