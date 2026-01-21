import { describe, expect, test } from 'vitest';
import * as Credential from './Credential.js';
describe('from', () => {
    test('default', () => {
        const credential = Credential.from({
            id: 'challenge-id',
            payload: { signature: '0x1234' },
        });
        expect(credential).toMatchInlineSnapshot(`
      {
        "id": "challenge-id",
        "payload": {
          "signature": "0x1234",
        },
      }
    `);
    });
    test('with source', () => {
        const credential = Credential.from({
            id: 'challenge-id',
            source: 'did:pkh:eip155:1:0x1234567890abcdef',
            payload: { hash: '0xabcd' },
        });
        expect(credential).toMatchInlineSnapshot(`
      {
        "id": "challenge-id",
        "payload": {
          "hash": "0xabcd",
        },
        "source": "did:pkh:eip155:1:0x1234567890abcdef",
      }
    `);
    });
});
//# sourceMappingURL=Credential.test.js.map