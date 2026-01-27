import type { Account } from 'viem'
import { describe, expect, test } from 'vitest'
import * as Challenge from '../Challenge.js'
import * as Credential from '../Credential.js'
import * as Intent from '../Intent.js'
import * as Method from '../Method.js'
import * as MethodIntent from '../MethodIntent.js'
import * as z from '../zod.js'
import * as Mpay from './Mpay.js'

const fooCharge = MethodIntent.fromIntent(Intent.charge, {
  method: 'test',
  schema: {
    credential: {
      payload: z.object({ signature: z.string() }),
    },
    request: {
      requires: ['recipient'],
    },
  },
})

const fooMethod = Method.from({
  name: 'test',
  intents: { charge: fooCharge },
})

const realm = 'api.example.com'
const secretKey = 'test-secret-key'

describe('Mpay.create', () => {
  test('default', () => {
    const clientMethod = Method.toClient(fooMethod, {
      async createCredential({ challenge }) {
        return Credential.serialize({
          challenge,
          payload: { signature: '0xtest' },
        })
      },
    })

    const mpay = Mpay.create({ methods: [clientMethod] })

    expect(mpay.methods).toHaveLength(1)
    expect(mpay.methods[0]?.name).toBe('test')
    expect(typeof mpay.createCredential).toBe('function')
  })

  test('behavior: with multiple methods', () => {
    const barCharge = MethodIntent.fromIntent(Intent.charge, {
      method: 'bar',
      schema: {
        credential: {
          payload: z.object({ token: z.string() }),
        },
        request: {
          requires: ['recipient'],
        },
      },
    })

    const barMethod = Method.from({
      name: 'bar',
      intents: { charge: barCharge },
    })

    const test = Method.toClient(fooMethod, {
      async createCredential({ challenge }) {
        return Credential.serialize({
          challenge,
          payload: { signature: '0xtest' },
        })
      },
    })

    const bar = Method.toClient(barMethod, {
      async createCredential({ challenge }) {
        return Credential.serialize({
          challenge,
          payload: { token: 'bar-token' },
        })
      },
    })

    const mpay = Mpay.create({ methods: [test, bar] })

    expect(mpay.methods).toHaveLength(2)
    expect(mpay.methods[0]?.name).toBe('test')
    expect(mpay.methods[1]?.name).toBe('bar')
  })
})

describe('createCredential', () => {
  test('behavior: routes to correct method based on challenge', async () => {
    const foo = Method.toClient(fooMethod, {
      async createCredential({ challenge }) {
        return Credential.serialize({
          challenge,
          payload: { signature: '0xtest-signature' },
        })
      },
    })

    const mpay = Mpay.create({ methods: [foo] })

    const challenge = Challenge.fromIntent(fooCharge, {
      realm,
      secretKey,
      request: {
        amount: '1000',
        currency: '0x1234',
        recipient: '0x5678',
      },
    })

    const response = new Response(null, {
      status: 402,
      headers: {
        'WWW-Authenticate': Challenge.serialize(challenge),
      },
    })

    const credential = await mpay.createCredential(response)

    expect(credential).toMatch(/^Payment /)

    const parsed = Credential.deserialize(credential)
    expect(parsed.payload).toEqual({ signature: '0xtest-signature' })
    expect(parsed.challenge.method).toBe('test')
  })

  test('behavior: throws when method not found', async () => {
    const clientMethod = Method.toClient(fooMethod, {
      async createCredential({ challenge }) {
        return Credential.serialize({
          challenge,
          payload: { signature: '0xtest' },
        })
      },
    })

    const mpay = Mpay.create({ methods: [clientMethod] })

    const challenge = Challenge.from({
      id: 'test-id',
      realm,
      method: 'unknown',
      intent: 'charge',
      request: { amount: '1000', currency: '0x1234' },
    })

    const response = new Response(null, {
      status: 402,
      headers: {
        'WWW-Authenticate': Challenge.serialize(challenge),
      },
    })

    await expect(mpay.createCredential(response)).rejects.toThrow(
      'No method found for "unknown". Available: test',
    )
  })

  test('behavior: routes to correct method with multiple methods', async () => {
    const barCharge = MethodIntent.fromIntent(Intent.charge, {
      method: 'bar',
      schema: {
        credential: {
          payload: z.object({ token: z.string() }),
        },
        request: {
          requires: ['recipient'],
        },
      },
    })

    const barMethod = Method.from({
      name: 'bar',
      intents: { charge: barCharge },
    })

    const test = Method.toClient(fooMethod, {
      async createCredential({ challenge }) {
        return Credential.serialize({
          challenge,
          payload: { signature: '0xtest' },
        })
      },
    })

    const bar = Method.toClient(barMethod, {
      async createCredential({ challenge }) {
        return Credential.serialize({
          challenge,
          payload: { token: 'bar-token' },
        })
      },
    })

    const mpay = Mpay.create({ methods: [test, bar] })

    const barChallenge = Challenge.fromIntent(barCharge, {
      realm,
      secretKey,
      request: {
        amount: '2000',
        currency: '0xabcd',
        recipient: '0xefgh',
      },
    })

    const response = new Response(null, {
      status: 402,
      headers: {
        'WWW-Authenticate': Challenge.serialize(barChallenge),
      },
    })

    const credential = await mpay.createCredential(response)
    const parsed = Credential.deserialize(credential)

    expect(parsed.payload).toEqual({ token: 'bar-token' })
    expect(parsed.challenge.method).toBe('bar')
  })

  test('behavior: passes context to createCredential', async () => {
    const contextCharge = MethodIntent.fromIntent(Intent.charge, {
      method: 'context-test',
      schema: {
        credential: {
          payload: z.object({ signer: z.string() }),
        },
        request: {
          requires: ['recipient'],
        },
      },
    })

    const contextMethod = Method.from({
      name: 'context-test',
      intents: { charge: contextCharge },
    })

    const clientWithContext = Method.toClient(contextMethod, {
      context: z.object({
        account: z.custom<Account>(),
      }),
      async createCredential({ challenge, context }) {
        return Credential.serialize({
          challenge,
          payload: { signer: context.account.address },
        })
      },
    })

    const mpay = Mpay.create({ methods: [clientWithContext] })

    const challenge = Challenge.fromIntent(contextCharge, {
      realm,
      secretKey,
      request: {
        amount: '1000',
        currency: '0x1234',
        recipient: '0x5678',
      },
    })

    const response = new Response(null, {
      status: 402,
      headers: {
        'WWW-Authenticate': Challenge.serialize(challenge),
      },
    })

    const mockAccount = { address: '0xMockAddress' } as unknown as Account
    const credential = await mpay.createCredential(response, { account: mockAccount })

    const parsed = Credential.deserialize(credential)
    expect(parsed.payload).toEqual({ signer: '0xMockAddress' })
  })

  test('behavior: works without context when method has no context schema', async () => {
    const noContextMethod = Method.toClient(fooMethod, {
      async createCredential({ challenge }) {
        return Credential.serialize({
          challenge,
          payload: { signature: '0xno-context' },
        })
      },
    })

    const mpay = Mpay.create({ methods: [noContextMethod] })

    const challenge = Challenge.fromIntent(fooCharge, {
      realm,
      secretKey,
      request: {
        amount: '1000',
        currency: '0x1234',
        recipient: '0x5678',
      },
    })

    const response = new Response(null, {
      status: 402,
      headers: {
        'WWW-Authenticate': Challenge.serialize(challenge),
      },
    })

    const credential = await mpay.createCredential(response)
    const parsed = Credential.deserialize(credential)
    expect(parsed.payload).toEqual({ signature: '0xno-context' })
  })
})
