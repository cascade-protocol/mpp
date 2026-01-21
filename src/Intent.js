import * as S from './Schema.js';
export { ValidationError } from './Schema.js';
export class VerificationError extends Error {
    name = 'Intent.VerificationError';
}
export class InvalidCredentialTypeError extends Error {
    name = 'Intent.InvalidCredentialTypeError';
    constructor(type) {
        super(`Invalid credential type: ${type}`);
    }
}
/**
 * Defines a payment intent.
 *
 * An intent describes a type of payment operation (e.g., charge, authorize, subscription)
 * and provides:
 * - A request schema for validating challenge parameters
 * - A verify function for validating credential payloads
 *
 * @example
 * ```ts
 * import { Intent } from 'mpay'
 * import { z } from 'zod'
 *
 * const charge = Intent.define({
 *   schema: {
 *     request: z.object({
 *       amount: z.string(),
 *       asset: z.string(),
 *       destination: z.string(),
 *       expires: z.string(),
 *     }),
 *     credentialPayload: z.object({
 *       signedTransaction: z.string(),
 *     }),
 *   },
 *   verify(credential) {
 *     // credential.id - the challenge ID
 *     // credential.source - optional payer DID
 *     // credential.payload - the validated payload
 *     return { receipt: { status: 'success', timestamp: '...', reference: '...' } }
 *   },
 * })
 *
 * // Create a well-formed request
 * const request = charge.request({ amount: '1000000', ... })
 * ```
 */
export function define(options) {
    const { schema, verify } = options;
    return {
        '~standard': {
            schema,
        },
        async request(input) {
            const result = await schema.request['~standard'].validate(input);
            return S.unwrap(result, 'request');
        },
        async verify(credential, request) {
            const result = await schema.credentialPayload['~standard'].validate(credential.payload);
            const payload = S.unwrap(result, 'credentialPayload');
            return verify({ ...credential, payload }, request);
        },
    };
}
//# sourceMappingURL=Intent.js.map