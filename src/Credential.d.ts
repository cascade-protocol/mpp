/**
 * The credential passed to the verify function.
 *
 * @example
 * ```ts
 * import { Credential } from 'mpay'
 *
 * const credential: Credential.Credential<{ signature: string }> = {
 *   id: 'challenge-id',
 *   payload: { signature: '0x...' },
 * }
 * ```
 */
export type Credential<payload = unknown> = {
    /** The challenge ID from the original 402 response */
    id: string;
    /** Optional payer identifier as a DID (e.g., "did:pkh:eip155:1:0x...") */
    source?: string | undefined;
    /** The validated credential payload */
    payload: payload;
};
/**
 * Creates a credential from the given parameters.
 *
 * @param parameters - Credential parameters.
 * @returns A credential.
 *
 * @example
 * ```ts
 * import { Credential } from 'mpay'
 *
 * const credential = Credential.from({
 *   id: 'challenge-id',
 *   payload: { signature: '0x...' },
 * })
 * ```
 */
export declare function from<credential extends Credential>(credential: credential): credential;
//# sourceMappingURL=Credential.d.ts.map