/**
 * A parsed payment challenge from a `WWW-Authenticate` header.
 *
 * @example
 * ```ts
 * import { Challenge } from 'mpay'
 *
 * const challenge: Challenge.Challenge = {
 *   id: 'challenge-id',
 *   method: 'tempo',
 *   intent: 'charge',
 *   request: { amount: '1000000', asset: '0x...', destination: '0x...' },
 * }
 * ```
 */
export type Challenge<request = unknown> = {
    /** Unique challenge identifier */
    id: string;
    /** Payment method (e.g., "tempo", "stripe") */
    method: string;
    /** Intent type (e.g., "charge", "authorize") */
    intent: string;
    /** Method-specific request data */
    request: request;
};
/**
 * Creates a challenge from the given parameters.
 *
 * @param challenge - Challenge parameters.
 * @returns A challenge.
 *
 * @example
 * ```ts
 * import { Challenge } from 'mpay'
 *
 * const challenge = Challenge.from({
 *   id: 'challenge-id',
 *   method: 'tempo',
 *   intent: 'charge',
 *   request: { amount: '1000000', asset: '0x...', destination: '0x...' },
 * })
 * ```
 */
export declare function from<challenge extends Challenge>(challenge: challenge): challenge;
//# sourceMappingURL=Challenge.d.ts.map