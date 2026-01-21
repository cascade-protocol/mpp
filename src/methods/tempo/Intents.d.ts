import { type Account, type Chain, type Client, type Transport } from 'viem';
import { z } from 'zod/mini';
import * as Intent from '../../Intent.js';
/**
 * Creates a Tempo `charge` intent.
 *
 * @example
 * ```ts
 * import { Intent } from 'mpay/tempo'
 *
 * const intent = Intent.charge(client)
 *
 * // Create a payment request
 * const request = await intent.request({
 *   amount: '1000000',
 *   asset: '0x20c0000000000000000000000000000000000001',
 *   destination: '0x...',
 *   expires: new Date(Date.now() + 60_000).toISOString(),
 * })
 *
 * // Generate the credential
 * const credential = TODO
 *
 * // Verify credential
 * const result = await intent.verify(credential, request)
 * ```
 *
 * @param client - Viem client to interact with Tempo.
 * @param options - Options.
 * @param options.account - Account to use for fee payer signing.
 * @returns An intent.
 */
export declare function charge<account extends Account | undefined = undefined>(client: Client<Transport, Chain, account>, options?: charge.Options): Intent.define.ReturnType<{
    request: z.ZodMiniObject<{
        amount: z.ZodMiniString<string>;
        asset: z.ZodMiniTemplateLiteral<`0x${string}`>;
        destination: z.ZodMiniTemplateLiteral<`0x${string}`>;
        expires: z.iso.ZodMiniISODateTime;
        feePayer: z.ZodMiniDefault<z.ZodMiniBoolean<boolean>>;
    }, z.core.$strip>;
    credentialPayload: z.ZodMiniDiscriminatedUnion<[z.ZodMiniObject<{
        type: z.ZodMiniLiteral<"hash">;
        hash: z.ZodMiniTemplateLiteral<`0x${string}`>;
    }, z.core.$strip>, z.ZodMiniObject<{
        type: z.ZodMiniLiteral<"transaction">;
        signature: z.ZodMiniTemplateLiteral<`0x${string}`>;
    }, z.core.$strip>], "type">;
}>;
export declare namespace charge {
    type Options = {
        account?: Account | undefined;
    };
    const schema: {
        request: z.ZodMiniObject<{
            amount: z.ZodMiniString<string>;
            asset: z.ZodMiniTemplateLiteral<`0x${string}`>;
            destination: z.ZodMiniTemplateLiteral<`0x${string}`>;
            expires: z.iso.ZodMiniISODateTime;
            feePayer: z.ZodMiniDefault<z.ZodMiniBoolean<boolean>>;
        }, z.core.$strip>;
        credentialPayload: z.ZodMiniDiscriminatedUnion<[z.ZodMiniObject<{
            type: z.ZodMiniLiteral<"hash">;
            hash: z.ZodMiniTemplateLiteral<`0x${string}`>;
        }, z.core.$strip>, z.ZodMiniObject<{
            type: z.ZodMiniLiteral<"transaction">;
            signature: z.ZodMiniTemplateLiteral<`0x${string}`>;
        }, z.core.$strip>], "type">;
    };
}
//# sourceMappingURL=Intents.d.ts.map