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

export const API_ROUTES = {
    auth: {
        login: "/api/auth/login",
        me: "/api/auth/me",
        logout: "/api/auth/logout",
    },
} as const;