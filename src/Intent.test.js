import { describe, expect, test } from 'vitest';
import { z } from 'zod';
import * as Intent from './Intent.js';
const charge = Intent.define({
    schema: {
        request: z.object({
            amount: z.string(),
            asset: z.templateLiteral([z.literal('0x'), z.string()]),
            destination: z.templateLiteral([z.literal('0x'), z.string()]),
            expires: z.iso.datetime(),
        }),
        credentialPayload: z.object({
            type: z.enum(['keyAuthorization', 'transaction']),
            signature: z.templateLiteral([z.literal('0x'), z.string()]),
        }),
    },
    async verify() {
        return {
            receipt: {
                status: 'success',
                timestamp: new Date().toISOString(),
                reference: '0xabc123...', // transaction hash
            },
        };
    },
});
describe('define', () => {
    describe('request', () => {
        test('default', async () => {
            const request = await charge.request({
                amount: '1000000',
                asset: '0x20c0000000000000000000000000000000000001',
                destination: '0x742d35Cc6634C0532925a3b844Bc9e7595f8fE00',
                expires: '2025-01-06T12:00:00Z',
            });
            expect(request).toMatchInlineSnapshot(`
        {
          "amount": "1000000",
          "asset": "0x20c0000000000000000000000000000000000001",
          "destination": "0x742d35Cc6634C0532925a3b844Bc9e7595f8fE00",
          "expires": "2025-01-06T12:00:00Z",
        }
      `);
        });
        test('throws on invalid asset address', async () => {
            await expect(charge.request({
                amount: '1000000',
                asset: 'not-an-address',
                destination: '0x742d35Cc6634C0532925a3b844Bc9e7595f8fE00',
                expires: '2025-01-06T12:00:00Z',
            })).rejects.toThrow(Intent.ValidationError);
        });
        test('throws on invalid expires format', async () => {
            await expect(charge.request({
                amount: '1000000',
                asset: '0x20c0000000000000000000000000000000000001',
                destination: '0x742d35Cc6634C0532925a3b844Bc9e7595f8fE00',
                expires: 'not-a-date',
            })).rejects.toThrow(Intent.ValidationError);
        });
    });
    describe('verify', () => {
        test('default', async () => {
            const { receipt: { timestamp, ...rest }, } = await charge.verify({
                id: 'kM9xPqWvT2nJrHsY4aDfEb',
                source: 'did:pkh:eip155:1:0x742d35Cc6634C0532925a3b844Bc9e7595f8fE00',
                payload: {
                    type: 'transaction',
                    signature: '0x76abc123...',
                },
            }, {
                amount: '1000000',
                asset: '0x20c0000000000000000000000000000000000001',
                destination: '0x742d35Cc6634C0532925a3b844Bc9e7595f8fE00',
                expires: '2025-01-06T12:00:00Z',
            });
            expect(timestamp).toBeDefined();
            expect(rest).toMatchInlineSnapshot(`
        {
          "reference": "0xabc123...",
          "status": "success",
        }
      `);
        });
        test('throws on invalid credential payload schema', async () => {
            await expect(charge.verify({
                id: 'test',
                payload: { type: 'invalid', signature: '0x123' },
            }, {
                amount: '1000000',
                asset: '0x20c0000000000000000000000000000000000001',
                destination: '0x742d35Cc6634C0532925a3b844Bc9e7595f8fE00',
                expires: '2025-01-06T12:00:00Z',
            })).rejects.toThrow(Intent.ValidationError);
        });
    });
});
//# sourceMappingURL=Intent.test.js.map