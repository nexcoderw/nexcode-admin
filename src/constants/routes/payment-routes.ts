export const PAYMENT_ROUTES = {
  list: "/payments",

  add: "/payments/add",

  detail: (
    agreementId: number,
  ) =>
    `/payments/detail/${agreementId}`,

  edit: (
    agreementId: number,
  ) =>
    `/payments/edit/${agreementId}`,
} as const;

export const PAYMENT_API_ROUTES = {
    agreementList:
        "/api/payment/agreement/list",

    agreementAdd:
        "/api/payment/agreement/add",

    agreementDetail: (
        id: number,
    ) =>
        `/api/payment/agreement/detail/${id}`,

    agreementUpdate: (
        id: number,
    ) =>
        `/api/payment/agreement/update/${id}`,

    agreementDelete: (
        id: number,
    ) =>
        `/api/payment/agreement/delete/${id}`,

    installmentList: (
        agreementId: number,
    ) =>
        `/api/payment/installment/list/${agreementId}`,

    installmentAdd: (
        agreementId: number,
    ) =>
        `/api/payment/installment/add/${agreementId}`,

    installmentUpdate: (
        id: number,
    ) =>
        `/api/payment/installment/update/${id}`,

    installmentDelete: (
        id: number,
    ) =>
        `/api/payment/installment/delete/${id}`,

    confirmMilestone: (
        id: number,
    ) =>
        `/api/payment/installment/confirm-milestone/${id}`,

    waiveInstallment: (
        id: number,
    ) =>
        `/api/payment/installment/waive/${id}`,

    recordList:
        "/api/payment/record/list",

    recordAdd: (
        agreementId: number,
    ) =>
        `/api/payment/record/add/${agreementId}`,

    recordAllocate: (
        id: number,
    ) =>
        `/api/payment/record/allocate/${id}`,

    recordVoid: (
        id: number,
    ) =>
        `/api/payment/record/void/${id}`,

    contractSchedule: (
        agreementId: number,
    ) =>
        `/api/payment/schedule/contract/${agreementId}`,

    maintenanceSchedule: (
        agreementId: number,
    ) =>
        `/api/payment/schedule/maintenance/${agreementId}`,

    agreementSummary: (
        agreementId: number,
    ) =>
        `/api/payment/summary/agreement/${agreementId}`,

    portfolioSummary: (
        portfolioId: number,
    ) =>
        `/api/payment/summary/portfolio/${portfolioId}`,

    reminderRuleList:
        "/api/payment/reminder/rule/list",

    reminderRuleAdd: (
        agreementId: number,
    ) =>
        `/api/payment/reminder/rule/add/${agreementId}`,

    reminderRuleDetail: (
        id: number,
    ) =>
        `/api/payment/reminder/rule/detail/${id}`,

    reminderRuleUpdate: (
        id: number,
    ) =>
        `/api/payment/reminder/rule/update/${id}`,

    reminderRuleDelete: (
        id: number,
    ) =>
        `/api/payment/reminder/rule/delete/${id}`,

    notificationList:
        "/api/payment/reminder/notification/list",

    notificationRead: (
        id: number,
    ) =>
        `/api/payment/reminder/notification/read/${id}`,

    notificationsReadAll:
        "/api/payment/reminder/notification/read-all",

    notificationRetry: (
        id: number,
    ) =>
        `/api/payment/reminder/notification/retry/${id}`,
} as const;