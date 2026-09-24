import { beforeEach, describe, expect, it, vi } from "vitest";

import { POST as addAgreement } from "@/app/api/payment/agreement/add/route";
import { GET as agreementDetail } from "@/app/api/payment/agreement/detail/[id]/route";
import { GET as listAgreements } from "@/app/api/payment/agreement/list/route";
import { GET as listNotifications } from "@/app/api/payment/reminder/notification/list/route";
import { COMMON_MESSAGE_KEYS } from "@/constants/messages/common-messages";
import { PAYMENT_MESSAGE_KEYS } from "@/constants/messages/payment-messages";
import { createClientRequest } from "@/test/client/request";
import {
    backendAgreement,
    backendPagination,
} from "@/test/payment/fixtures";

/*
 * Only the transport to Django and the CSRF fetch are mocked, so each
 * test runs the real route, endpoint, mapper and error narrowing.
 */
const mocks = vi.hoisted(() => ({
    backendRequest: vi.fn(),
    getAdminCsrf: vi.fn(),
}));

vi.mock("@/endpoints/client", () => ({
    backendRequest: mocks.backendRequest,
}));

vi.mock("@/endpoints/auth/get-csrf", () => ({
    getAdminCsrf: mocks.getAdminCsrf,
}));

// Wording Django might send that must never reach the browser.
const RAW_DJANGO_MESSAGE =
    "IntegrityError at /api/admin/payment/: duplicate key value violates unique constraint";

function djangoResponse(status: number, data: unknown) {
    return {
        ok: status >= 200 && status < 300,
        status,
        data,
        headers: new Headers(),
    };
}

function detailContext(id: string) {
    return { params: Promise.resolve({ id }) };
}

const AGREEMENT_INPUT = {
    portfolioId: 7,
    title: "Admin platform build",
    agreementType: "project",
    currency: "RWF",
    totalAmount: "1000000.00",
    agreementDate: "2026-09-01",
    startDate: "2026-09-02",
};

describe("Payment BFF routes", () => {
    beforeEach(() => {
        mocks.getAdminCsrf.mockResolvedValue({
            cookie: "fresh-csrf-cookie",
            token: "fresh-csrf-token",
        });
    });

    it("requires a session before calling the backend", async () => {
        const response = await listAgreements(
            createClientRequest("/api/payment/agreement/list", {
                authenticated: false,
            }),
        );

        expect(response.status).toBe(401);
        expect(mocks.backendRequest).not.toHaveBeenCalled();
    });

    it("requires a session for the notification list", async () => {
        const response = await listNotifications(
            createClientRequest("/api/payment/reminder/notification/list", {
                authenticated: false,
            }),
        );

        expect(response.status).toBe(401);
        expect(mocks.backendRequest).not.toHaveBeenCalled();
    });

    it("rejects an invalid route id before calling the endpoint", async () => {
        for (const id of ["abc", "0", "-3", "1.5"]) {
            const response = await agreementDetail(
                createClientRequest(`/api/payment/agreement/detail/${id}`),
                detailContext(id),
            );

            expect(response.status).toBe(400);
        }

        expect(mocks.backendRequest).not.toHaveBeenCalled();
    });

    it("rejects an unsupported ordering before calling the endpoint", async () => {
        const response = await listAgreements(
            createClientRequest(
                "/api/payment/agreement/list?ordering=password",
            ),
        );

        expect(response.status).toBe(400);
        expect(mocks.backendRequest).not.toHaveBeenCalled();
    });

    it("forwards valid filters in the backend's names", async () => {
        mocks.backendRequest.mockResolvedValue(
            djangoResponse(200, {
                data: {
                    items: [backendAgreement()],
                    pagination: backendPagination(),
                },
            }),
        );

        const response = await listAgreements(
            createClientRequest(
                "/api/payment/agreement/list?ordering=-total_amount&portfolioId=7",
            ),
        );

        expect(response.status).toBe(200);

        const [path] = mocks.backendRequest.mock.calls[0];

        expect(path).toContain("ordering=-total_amount");
        expect(path).toContain("portfolio_id=7");

        const body = await response.json();

        expect(body.data.items[0].totalAmount).toBe("1000000.00");
    });

    it("strips unknown JSON fields before they reach the backend", async () => {
        mocks.backendRequest.mockResolvedValue(
            djangoResponse(201, { data: { agreement: backendAgreement() } }),
        );

        const response = await addAgreement(
            createClientRequest("/api/payment/agreement/add", {
                method: "POST",
                json: {
                    ...AGREEMENT_INPUT,
                    isAdmin: true,
                    is_admin: true,
                    createdBy: 1,
                    id: 99,
                },
            }),
        );

        expect(response.status).toBe(201);

        const [, options] = mocks.backendRequest.mock.calls[0];

        expect(options.body).toEqual({
            portfolio_id: 7,
            title: "Admin platform build",
            agreement_type: "project",
            currency: "RWF",
            total_amount: "1000000.00",
            agreement_date: "2026-09-01",
            start_date: "2026-09-02",
        });
    });

    it("maps a Django 404 to a local not-found message key", async () => {
        mocks.backendRequest.mockResolvedValue(
            djangoResponse(404, {
                status: "error",
                message: RAW_DJANGO_MESSAGE,
            }),
        );

        const response = await agreementDetail(
            createClientRequest("/api/payment/agreement/detail/12"),
            detailContext("12"),
        );

        const text = await response.text();

        expect(response.status).toBe(404);
        expect(JSON.parse(text)).toEqual({
            success: false,
            messageKey: PAYMENT_MESSAGE_KEYS.agreementNotFound,
        });
        expect(text).not.toContain("IntegrityError");
    });

    it("returns only known field keys from a Django 400", async () => {
        mocks.backendRequest.mockResolvedValue(
            djangoResponse(400, {
                status: "error",
                message: RAW_DJANGO_MESSAGE,
                errors: {
                    total_amount: [RAW_DJANGO_MESSAGE],
                    __all__: ["Start date must be before end date."],
                    internal_ledger_id: ["Unexpected field."],
                },
            }),
        );

        const response = await addAgreement(
            createClientRequest("/api/payment/agreement/add", {
                method: "POST",
                json: AGREEMENT_INPUT,
            }),
        );

        const text = await response.text();
        const body = JSON.parse(text);

        expect(response.status).toBe(400);
        expect(body.messageKey).toBe(PAYMENT_MESSAGE_KEYS.invalidRequest);
        expect([...body.fields].sort()).toEqual(["__all__", "totalAmount"]);
        expect(text).not.toContain("IntegrityError");
        expect(text).not.toContain("internal_ledger_id");
        expect(text).not.toContain("Start date must be before end date.");
    });

    it("replaces a Django 500 with a local 503", async () => {
        mocks.backendRequest.mockResolvedValue(
            djangoResponse(500, {
                status: "error",
                message: RAW_DJANGO_MESSAGE,
                traceback: "File \"/srv/app/admin_api/views/payment.py\"",
            }),
        );

        const response = await agreementDetail(
            createClientRequest("/api/payment/agreement/detail/12"),
            detailContext("12"),
        );

        const text = await response.text();

        expect(response.status).toBe(503);
        expect(JSON.parse(text)).toEqual({
            success: false,
            messageKey: COMMON_MESSAGE_KEYS.serviceUnavailable,
        });
        expect(text).not.toContain("IntegrityError");
        expect(text).not.toContain("/srv/app");
    });

    it("replaces a malformed backend payload with a local 503", async () => {
        mocks.backendRequest.mockResolvedValue(
            djangoResponse(200, {
                data: { agreement: backendAgreement({ total_amount: "lots" }) },
            }),
        );

        const response = await agreementDetail(
            createClientRequest("/api/payment/agreement/detail/12"),
            detailContext("12"),
        );

        expect(response.status).toBe(503);
    });

    it("replaces a network failure with a local 503", async () => {
        mocks.backendRequest.mockRejectedValue(new Error(RAW_DJANGO_MESSAGE));

        const response = await agreementDetail(
            createClientRequest("/api/payment/agreement/detail/12"),
            detailContext("12"),
        );

        expect(response.status).toBe(503);
        expect(await response.text()).not.toContain("IntegrityError");
    });

    it("sends mutations with a CSRF token from the CSRF helper", async () => {
        mocks.backendRequest.mockResolvedValue(
            djangoResponse(201, { data: { agreement: backendAgreement() } }),
        );

        const response = await addAgreement(
            createClientRequest("/api/payment/agreement/add", {
                method: "POST",
                json: AGREEMENT_INPUT,
                includeCsrf: false,
            }),
        );

        expect(response.status).toBe(201);
        expect(mocks.getAdminCsrf).toHaveBeenCalledTimes(1);

        const [, options] = mocks.backendRequest.mock.calls[0];
        const headers = options.headers as Headers;

        expect(options.method).toBe("POST");
        expect(headers.get("X-CSRFToken")).toBe("fresh-csrf-token");
        expect(headers.get("Cookie")).toContain("csrftoken=fresh-csrf-cookie");
        expect(headers.get("Cookie")).toContain("sessionid=django-session");
    });

    it("refreshes the CSRF token once when Django rejects it", async () => {
        mocks.backendRequest
            .mockResolvedValueOnce(djangoResponse(403, { message: "CSRF failed" }))
            .mockResolvedValueOnce(
                djangoResponse(201, { data: { agreement: backendAgreement() } }),
            );

        const response = await addAgreement(
            createClientRequest("/api/payment/agreement/add", {
                method: "POST",
                json: AGREEMENT_INPUT,
            }),
        );

        expect(response.status).toBe(201);
        expect(mocks.getAdminCsrf).toHaveBeenCalledTimes(1);
        expect(mocks.backendRequest).toHaveBeenCalledTimes(2);

        const [, retry] = mocks.backendRequest.mock.calls[1];

        expect((retry.headers as Headers).get("X-CSRFToken")).toBe(
            "fresh-csrf-token",
        );
    });
});
