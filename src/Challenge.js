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
export function from(challenge) {
    return challenge;
}
//# sourceMappingURL=Challenge.js.map