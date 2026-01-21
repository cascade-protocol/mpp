import { describe, expect, test } from 'vitest';
import * as Receipt from './Receipt.js';
describe('from', () => {
    test('default', () => {
        const receipt = Receipt.from({
            status: 'success',
            timestamp: '2025-01-21T12:00:00.000Z',
            reference: '0x1234',
        });
        expect(receipt).toMatchInlineSnapshot(`
      {
        "reference": "0x1234",
        "status": "success",
        "timestamp": "2025-01-21T12:00:00.000Z",
      }
    `);
    });
    test('failed status', () => {
        const receipt = Receipt.from({
            status: 'failed',
            timestamp: '2025-01-21T13:00:00.000Z',
            reference: '0xabcd',
        });
        expect(receipt).toMatchInlineSnapshot(`
      {
        "reference": "0xabcd",
        "status": "failed",
        "timestamp": "2025-01-21T13:00:00.000Z",
      }
    `);
    });
});
//# sourceMappingURL=Receipt.test.js.map