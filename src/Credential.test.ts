import { describe, expect, test } from 'vitest'
import * as Credential from './Credential.js'

describe('from', () => {
  test('behavior: creates credential', () => {
    const credential = Credential.from({
      id: 'challenge-id',
      payload: { signature: '0x1234' },
    })

    expect(credential).toMatchInlineSnapshot(`
      {
        "id": "challenge-id",
        "payload": {
          "signature": "0x1234",
        },
      }
    `)
  })

  test('behavior: creates credential with source', () => {
    const credential = Credential.from({
      id: 'challenge-id',
      source: 'did:pkh:eip155:1:0x1234567890abcdef',
      payload: { hash: '0xabcd' },
    })

    expect(credential).toMatchInlineSnapshot(`
      {
        "id": "challenge-id",
        "payload": {
          "hash": "0xabcd",
        },
        "source": "did:pkh:eip155:1:0x1234567890abcdef",
      }
    `)
  })
})

describe('serialize', () => {
  test('behavior: serializes credential to Authorization header format', () => {
    const credential = Credential.from({
      id: 'challenge-id',
      payload: { signature: '0x1234' },
    })

    const header = Credential.serialize(credential)

    expect(header).toMatchInlineSnapshot(
      `"Payment eyJpZCI6ImNoYWxsZW5nZS1pZCIsInBheWxvYWQiOnsic2lnbmF0dXJlIjoiMHgxMjM0In19"`,
    )
  })

  test('behavior: serializes credential with source', () => {
    const credential = Credential.from({
      id: 'challenge-id',
      source: 'did:pkh:eip155:1:0x1234567890abcdef',
      payload: { hash: '0xabcd' },
    })

    const header = Credential.serialize(credential)

    expect(header).toMatchInlineSnapshot(
      `"Payment eyJpZCI6ImNoYWxsZW5nZS1pZCIsInNvdXJjZSI6ImRpZDpwa2g6ZWlwMTU1OjE6MHgxMjM0NTY3ODkwYWJjZGVmIiwicGF5bG9hZCI6eyJoYXNoIjoiMHhhYmNkIn19"`,
    )
  })
})

describe('deserialize', () => {
  test('behavior: deserializes Authorization header to credential', () => {
    const header =
      'Payment eyJpZCI6ImNoYWxsZW5nZS1pZCIsInBheWxvYWQiOnsic2lnbmF0dXJlIjoiMHgxMjM0In19'

    const credential = Credential.deserialize(header)

    expect(credential).toMatchInlineSnapshot(`
      {
        "id": "challenge-id",
        "payload": {
          "signature": "0x1234",
        },
      }
    `)
  })

  test('behavior: deserializes credential with source', () => {
    const header =
      'Payment eyJpZCI6ImNoYWxsZW5nZS1pZCIsInNvdXJjZSI6ImRpZDpwa2g6ZWlwMTU1OjE6MHgxMjM0NTY3ODkwYWJjZGVmIiwicGF5bG9hZCI6eyJoYXNoIjoiMHhhYmNkIn19'

    const credential = Credential.deserialize(header)

    expect(credential).toMatchInlineSnapshot(`
      {
        "id": "challenge-id",
        "payload": {
          "hash": "0xabcd",
        },
        "source": "did:pkh:eip155:1:0x1234567890abcdef",
      }
    `)
  })

  test('error: missing Payment scheme', () => {
    expect(() => Credential.deserialize('Bearer abc123')).toThrowErrorMatchingInlineSnapshot(
      `[Error: Invalid credential: missing Payment scheme]`,
    )
  })
})

describe('fromRequest', () => {
  test('behavior: extracts credential from Request', () => {
    const request = new Request('https://api.example.com/resource', {
      headers: {
        Authorization:
          'Payment eyJpZCI6ImNoYWxsZW5nZS1pZCIsInBheWxvYWQiOnsic2lnbmF0dXJlIjoiMHgxMjM0In19',
      },
    })

    const credential = Credential.fromRequest(request)

    expect(credential).toMatchInlineSnapshot(`
      {
        "id": "challenge-id",
        "payload": {
          "signature": "0x1234",
        },
      }
    `)
  })

  test('error: missing Authorization header', () => {
    const request = new Request('https://api.example.com/resource')

    expect(() => Credential.fromRequest(request)).toThrowErrorMatchingInlineSnapshot(
      `[Error: Missing Authorization header]`,
    )
  })
})
