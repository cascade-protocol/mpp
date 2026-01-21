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
    status: 'success' | 'failed';
    /** ISO 8601 settlement timestamp. */
    timestamp: string;
    /** Method-specific reference (e.g., transaction hash). */
    reference: string;
};
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
export declare function from(parameters: from.Parameters): from.ReturnType;
export declare namespace from {
    type Parameters = {
        status: 'success' | 'failed';
        timestamp: string;
        reference: string;
    };
    type ReturnType = Receipt;
    type ErrorType = never;
}
//# sourceMappingURL=Receipt.d.ts.map