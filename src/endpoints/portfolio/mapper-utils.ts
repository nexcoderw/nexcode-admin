import "server-only";

export type UnknownRecord =
    Record<string, unknown>;

export function asRecord(
    value: unknown,
): UnknownRecord | null {
    return (
        value &&
        typeof value ===
        "object" &&
        !Array.isArray(value)
    )
        ? value as UnknownRecord
        : null;
}

export function mapArray<T>(
    value: unknown,
    mapper: (
        item: unknown,
    ) => T | null,
): T[] | null {
    if (!Array.isArray(value)) {
        return null;
    }

    const items: T[] = [];

    for (const valueItem of value) {
        const mapped =
            mapper(valueItem);

        if (!mapped) {
            return null;
        }

        items.push(mapped);
    }

    return items;
}

export function isChoice<
    T extends string,
>(
    value: unknown,
    choices: readonly T[],
): value is T {
    return (
        typeof value ===
        "string" &&
        (
            choices as
            readonly string[]
        ).includes(value)
    );
}

export function isString(
    value: unknown,
): value is string {
    return (
        typeof value ===
        "string"
    );
}

export function isNullableString(
    value: unknown,
): value is string | null {
    return (
        value === null ||
        typeof value ===
        "string"
    );
}

export function isNumber(
    value: unknown,
): value is number {
    return (
        typeof value ===
        "number" &&
        Number.isFinite(value)
    );
}

export function isBoolean(
    value: unknown,
): value is boolean {
    return (
        typeof value ===
        "boolean"
    );
}