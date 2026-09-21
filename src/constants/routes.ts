export const ROUTES = {
    auth: {
        login: '/login',
        forgotPassword: '/forgot-password',
        resetPassword: '/reset-password',
        verify: '/verify',
    },

    admin: {
        dashboard: '/',

        portfolios: '/portfolios',
        clients: '/clients',
        team: '/team',

        blogs: '/blogs',
        trainings: '/trainings',
        testimonials: '/testimonials',

        contacts: '/contacts',

        payments: '/payments',
        paymentStatuses: '/payments/statuses',

        settings: '/settings',
    },
} as const;