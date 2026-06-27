/**
 * Serialization utilities for ICP backend values.
 *
 * ICP Motoko types regularly produce `bigint` values (timestamps, counts, etc.).
 * Mutating `BigInt.prototype.toJSON` globally causes side-effects for third-party
 * libraries. These helpers keep the serialization concern localized to call sites
 * that interact with backend data.
 */

/** JSON replacer that converts bigint values to their string representation. */
export function bigintReplacer(_key: string, value: unknown): unknown {
  return typeof value === "bigint" ? value.toString() : value;
}

/**
 * JSON.stringify wrapper that handles bigint values produced by the ICP backend.
 * Use this everywhere backend-derived data is serialized (localStorage, sessionStorage,
 * log sinks, etc.) instead of relying on a global prototype patch.
 */
export function safeStringify(value: unknown, space?: number): string {
  return JSON.stringify(value, bigintReplacer, space);
}

/**
 * JSON.parse wrapper that revives numeric strings back to bigint when the original
 * field is known to be a bigint. Pass a custom reviver when precise type restoration
 * is required; otherwise use this as a plain JSON.parse alias for symmetry.
 */
export function safeParse<T = unknown>(text: string): T {
  return JSON.parse(text) as T;
}
