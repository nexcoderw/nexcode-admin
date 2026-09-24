import "server-only";

import {
    requestPaymentEndpoint,
} from "@/endpoints/payment/endpoint-helper";
import {
    mapInstallmentList,
} from "@/endpoints/payment/installment-mapper";
import {
    toBackendMaintenanceSchedulePayload,
} from "@/endpoints/payment/payload";
import type {
    PaymentMutationCsrf,
} from "@/endpoints/payment/types";
import type {
    MaintenanceScheduleInput,
} from "@/types/payment/schedule";
import type {
    PaymentInstallment,
} from "@/types/payment/installment";

export function generateMaintenanceSchedule(
    agreementId: number,
    input: MaintenanceScheduleInput,
    sessionId: string,
    csrf: PaymentMutationCsrf,
    forwarded: Headers,
) {
    return requestPaymentEndpoint<
        PaymentInstallment[]
    >({
        path:
            `/api/admin/payment/schedule/maintenance/${agreementId}/`,

        method: "POST",

        body:
            toBackendMaintenanceSchedulePayload(
                input,
            ),

        sessionId,
        csrf,
        forwarded,

        mapData:
            mapInstallmentList,
    });
}
