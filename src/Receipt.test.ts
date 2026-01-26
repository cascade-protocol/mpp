import { describe, expect, test } from 'vitest'
import * as Receipt from './Receipt.js'

describe('from', () => {
  test('behavior: creates receipt with success status', () => {
    const receipt = Receipt.from({
      status: 'success',
      timestamp: '2025-01-21T12:00:00.000Z',
      reference: '0x1234',
    })

    expect(receipt).toMatchInlineSnapshot(`
      {
        "reference": "0x1234",
        "status": "success",
        "timestamp": "2025-01-21T12:00:00.000Z",
      }
    `)
  })

  test('behavior: creates receipt with failed status', () => {
    const receipt = Receipt.from({
      status: 'failed',
      timestamp: '2025-01-21T13:00:00.000Z',
      reference: '0xabcd',
    })

    expect(receipt).toMatchInlineSnapshot(`
      {
        "reference": "0xabcd",
        "status": "failed",
        "timestamp": "2025-01-21T13:00:00.000Z",
      }
    `)
  })
})

describe('serialize', () => {
  test('behavior: serializes receipt to base64url', () => {
    const receipt = Receipt.from({
      status: 'success',
      timestamp: '2025-01-21T12:00:00.000Z',
      reference: '0x1234',
    })

    const header = Receipt.serialize(receipt)

    expect(header).toMatchInlineSnapshot(
      `"eyJzdGF0dXMiOiJzdWNjZXNzIiwidGltZXN0YW1wIjoiMjAyNS0wMS0yMVQxMjowMDowMC4wMDBaIiwicmVmZXJlbmNlIjoiMHgxMjM0In0"`,
    )
  })
})

describe('deserialize', () => {
  test('behavior: deserializes base64url to receipt', () => {
    const encoded =
      'eyJzdGF0dXMiOiJzdWNjZXNzIiwidGltZXN0YW1wIjoiMjAyNS0wMS0yMVQxMjowMDowMC4wMDBaIiwicmVmZXJlbmNlIjoiMHgxMjM0In0'

    const receipt = Receipt.deserialize(encoded)

    expect(receipt).toMatchInlineSnapshot(`
      {
        "reference": "0x1234",
        "status": "success",
        "timestamp": "2025-01-21T12:00:00.000Z",
      }
    `)
  })
})
