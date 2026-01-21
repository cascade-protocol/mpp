import type * as Credential from './Credential.js';
import type * as Receipt from './Receipt.js';
import * as S from './Schema.js';
export { ValidationError } from './Schema.js';
export declare class VerificationError extends Error {
    readonly name = "Intent.VerificationError";
}
export declare class InvalidCredentialTypeError extends Error {
    readonly name = "Intent.InvalidCredentialTypeError";
    constructor(type: string);
}
type Schema = {
    request: S.Schema;
    credentialPayload: S.Schema;
};
export type Intent<schema extends Schema> = {
    readonly '~standard': {
        readonly schema: schema;
    };
    /**
     * Create a well-formed request payload.
     * Validates input against the request schema and returns the typed output.
     */
    request(input: S.Schema.InferInput<schema['request']>): Promise<S.Schema.InferOutput<schema['request']>>;
    /**
     * Verifies a Payment credential.
     */
    verify(credential: Credential.Credential<S.Schema.InferOutput<schema['credentialPayload']>>, request: S.Schema.InferOutput<schema['request']>): Promise<verify.ReturnValue>;
};
export declare namespace verify {
    type ReturnValue = {
        /** Receipt data for Payment-Receipt header. */
        receipt: Receipt.Receipt;
    };
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
export declare function define<const schema extends Schema>(options: define.Options<schema>): define.ReturnType<schema>;
export declare namespace define {
    type Options<schema extends Schema> = {
        /** Schemas for request and credential validation. */
        schema: schema;
        /** Verifies a credential. */
        verify: Intent<schema>['verify'];
    };
    type ReturnType<schema extends Schema> = Intent<schema>;
}
//# sourceMappingURL=Intent.d.ts.map