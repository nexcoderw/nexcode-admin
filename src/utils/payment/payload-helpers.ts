/*
 * Shared checks for the payment payload sanitizers: each copy helper
 * copies one field when it has the expected type, and reports false
 * when a field is present with the wrong type.
 *
 * Targets are typed as object because the payment input interfaces have
 * no index signature, so they are not assignable to Record<string, unknown>.
 */

export type RecordValue =
    Record<string, unknown>;

export function record(
    value: unknown,
): RecordValue | null {
    return (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
    )
        ? value as RecordValue
        : null;
}

export function oneOf<T extends string>(
    value: unknown,
    choices: readonly T[],
): value is T {
    return (
        typeof value === "string" &&
        choices.includes(
            value as T,
        )
    );
}

export function copyString(
    source: RecordValue,
    target: object,
    key: string,
) {
    if (!(key in source)) {
        return true;
    }

    if (
        typeof source[key]
        !== "string"
    ) {
        return false;
    }

    (target as RecordValue)[key] =
        source[key];

    return true;
}

export function copyNumber(
    source: RecordValue,
    target: object,
    key: string,
) {
    if (!(key in source)) {
        return true;
    }

    if (
        typeof source[key]
        !== "number" ||
        !Number.isFinite(
            source[key],
        )
    ) {
        return false;
    }

    (target as RecordValue)[key] =
        source[key];

    return true;
}

export function copyBoolean(
    source: RecordValue,
    target: object,
    key: string,
) {
    if (!(key in source)) {
        return true;
    }

    if (
        typeof source[key]
        !== "boolean"
    ) {
        return false;
    }

    (target as RecordValue)[key] =
        source[key];

    return true;
}

export function copyChoice<
    T extends string,
>(
    source: RecordValue,
    target: object,
    key: string,
    choices: readonly T[],
) {
    if (!(key in source)) {
        return true;
    }

    if (
        !oneOf(
            source[key],
            choices,
        )
    ) {
        return false;
    }

    (target as RecordValue)[key] =
        source[key];

    return true;
}
