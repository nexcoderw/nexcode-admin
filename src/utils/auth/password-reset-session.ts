import "server-only";

import type {
    NextResponse,
} from "next/server";

export const ADMIN_PASSWORD_RESET_CHALLENGE_COOKIE =
    "nexcode_admin_password_reset_challenge";

export const ADMIN_PASSWORD_RESET_TOKEN_COOKIE =
    "nexcode_admin_password_reset_token";

const PASSWORD_RESET_COOKIE_PATH =
    "/api/auth/password-reset";

const CHALLENGE_MAX_AGE_SECONDS =
    10 * 60;

const RESET_TOKEN_MAX_AGE_SECONDS =
    15 * 60;

function cookieOptions() {
    return {
        httpOnly: true,
        secure:
            process.env.NODE_ENV ===
            "production",
        sameSite: "strict" as const,
        path: PASSWORD_RESET_COOKIE_PATH,
    };
}

export function setPasswordResetChallenge(
    response: NextResponse,
    challengeId: string,
) {
    response.cookies.set(
        ADMIN_PASSWORD_RESET_CHALLENGE_COOKIE,
        challengeId,
        {
            ...cookieOptions(),
            maxAge:
                CHALLENGE_MAX_AGE_SECONDS,
        },
    );
}

export function clearPasswordResetChallenge(
    response: NextResponse,
) {
    response.cookies.set(
        ADMIN_PASSWORD_RESET_CHALLENGE_COOKIE,
        "",
        {
            ...cookieOptions(),
            maxAge: 0,
        },
    );
}

export function setPasswordResetToken(
    response: NextResponse,
    resetToken: string,
) {
    response.cookies.set(
        ADMIN_PASSWORD_RESET_TOKEN_COOKIE,
        resetToken,
        {
            ...cookieOptions(),
            maxAge:
                RESET_TOKEN_MAX_AGE_SECONDS,
        },
    );
}

export function clearPasswordResetToken(
    response: NextResponse,
) {
    response.cookies.set(
        ADMIN_PASSWORD_RESET_TOKEN_COOKIE,
        "",
        {
            ...cookieOptions(),
            maxAge: 0,
        },
    );
}

export function clearPasswordResetSession(
    response: NextResponse,
) {
    clearPasswordResetChallenge(
        response,
    );

    clearPasswordResetToken(
        response,
    );
}