import { describe, expect, test } from 'vitest';
import * as Challenge from './Challenge.js';
describe('from', () => {
    test('default', () => {
        const challenge = Challenge.from({
            id: 'challenge-id',
            method: 'tempo',
            intent: 'charge',
            request: { amount: '1000000', asset: '0x1234', destination: '0xabcd' },
        });
        expect(challenge).toMatchInlineSnapshot(`
      {
        "id": "challenge-id",
        "intent": "charge",
        "method": "tempo",
        "request": {
          "amount": "1000000",
          "asset": "0x1234",
          "destination": "0xabcd",
        },
      }
    `);
    });
});
//# sourceMappingURL=Challenge.test.js.map