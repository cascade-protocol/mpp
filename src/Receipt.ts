import { Base64 } from 'ox'

/**
 * Payment receipt returned after verification.
 *
 * @example
 * ```ts
 * import { Receipt } from 'mpay'
 *
 * const receipt: Receipt.Receipt = {
 *   status: 'success',
 *   timestamp: new Date().toISOString(),
 *   reference: '0x...',
 * }
 * ```
 */
export type Receipt = {
  /** Payment status. */
  status: 'success' | 'failed'
  /** ISO 8601 settlement timestamp. */
  timestamp: string
  /** Method-specific reference (e.g., transaction hash). */
  reference: string
}

/**
 * Deserializes a Payment-Receipt header value to a receipt.
 *
 * @param encoded - The base64url-encoded header value.
 * @returns The deserialized receipt.
 *
 * @example
 * ```ts
 * import { Receipt } from 'mpay'
 *
 * const receipt = Receipt.deserialize(encoded)
 * ```
 */
export function deserialize(encoded: string): Receipt {
  const json = Base64.toString(encoded)
  return JSON.parse(json)
}

/**
 * Creates a receipt from the given parameters.
 *
 * @param parameters - Receipt parameters.
 * @returns A receipt.
 *
 * @example
 * ```ts
 * import { Receipt } from 'mpay'
 *
 * const receipt = Receipt.from({
 *   status: 'success',
 *   timestamp: new Date().toISOString(),
 *   reference: '0x...',
 * })
 * ```
 */
export function from(parameters: from.Parameters): from.ReturnType {
  return {
    status: parameters.status,
    timestamp: parameters.timestamp,
    reference: parameters.reference,
  }
}

export declare namespace from {
  type Parameters = {
    status: 'success' | 'failed'
    timestamp: string
    reference: string
  }
  type ReturnType = Receipt
  type ErrorType = never
}

/**
 * Serializes a receipt to the Payment-Receipt header format.
 *
 * @param receipt - The receipt to serialize.
 * @returns A base64url-encoded string suitable for the Payment-Receipt header value.
 *
 * @example
 * ```ts
 * import { Receipt } from 'mpay'
 *
 * const header = Receipt.serialize(receipt)
 * // => "eyJzdGF0dXMiOiJzdWNjZXNzIiwidGltZXN0YW1wIjoi..."
 * ```
 */
export function serialize(receipt: Receipt): string {
  const json = JSON.stringify(receipt)
  return Base64.fromString(json, { pad: false, url: true })
}
