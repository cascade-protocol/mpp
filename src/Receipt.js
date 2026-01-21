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
export function from(parameters) {
    return {
        status: parameters.status,
        timestamp: parameters.timestamp,
        reference: parameters.reference,
    };
}
//# sourceMappingURL=Receipt.js.map