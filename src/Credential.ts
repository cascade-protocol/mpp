import { Base64 } from 'ox'
import { z } from 'zod/mini'

/**
 * Zod schema for a payment credential.
 *
 * @example
 * ```ts
 * import { Credential } from 'mpay'
 *
 * const credential = Credential.Schema.parse(data)
 * ```
 */
export const Schema = z.object({
  /** The challenge ID from the original 402 response. */
  id: z.string(),
  /** The validated credential payload. */
  payload: z.unknown(),
  /** Optional payer identifier as a DID (e.g., "did:pkh:eip155:1:0x..."). */
  source: z.optional(z.string()),
})

/**
 * The credential passed to the verify function.
 *
 * @example
 * ```ts
 * import { Credential } from 'mpay'
 *
 * const credential: Credential.Credential<{ signature: string }> = {
 *   id: 'challenge-id',
 *   payload: { signature: '0x...' },
 * }
 * ```
 */
export type Credential<payload = unknown> = Omit<z.infer<typeof Schema>, 'payload'> & {
  payload: payload
}

/**
 * Deserializes an Authorization header value to a credential.
 *
 * @param header - The Authorization header value.
 * @returns The deserialized credential.
 *
 * @example
 * ```ts
 * import { Credential } from 'mpay'
 *
 * const credential = Credential.deserialize(header)
 * ```
 */
export function deserialize<payload = unknown>(value: string): Credential<payload> {
  const prefixMatch = value.match(/^Payment\s+(.+)$/i)
  if (!prefixMatch?.[1]) throw new Error('Invalid credential: missing Payment scheme')

  const json = Base64.toString(prefixMatch[1])
  return Schema.parse(JSON.parse(json)) as Credential<payload>
}

/**
 * Creates a credential from the given parameters.
 *
 * @param parameters - Credential parameters.
 * @returns A credential.
 *
 * @example
 * ```ts
 * import { Credential } from 'mpay'
 *
 * const credential = Credential.from({
 *   id: 'challenge-id',
 *   payload: { signature: '0x...' },
 * })
 * ```
 */
export function from<credential extends Credential>(credential: credential): credential {
  return credential
}

/**
 * Extracts the credential from a Request's Authorization header.
 *
 * @param request - The HTTP request.
 * @returns The deserialized credential.
 *
 * @example
 * ```ts
 * import { Credential } from 'mpay'
 *
 * const credential = Credential.fromRequest(request)
 * ```
 */
export function fromRequest<payload = unknown>(request: Request): Credential<payload> {
  const header = request.headers.get('Authorization')
  if (!header) throw new Error('Missing Authorization header')

  return deserialize<payload>(header)
}

/**
 * Serializes a credential to the Authorization header format.
 *
 * @param credential - The credential to serialize.
 * @returns A string suitable for the Authorization header value.
 *
 * @example
 * ```ts
 * import { Credential } from 'mpay'
 *
 * const header = Credential.serialize(credential)
 * // => 'Payment eyJpZCI6ImNoYWxsZW5nZS1pZCIsInBheWxvYWQiOnsi...'
 * ```
 */
export function serialize(credential: Credential): string {
  const json = JSON.stringify(credential)
  const encoded = Base64.fromString(json, { pad: false, url: true })
  return `Payment ${encoded}`
}
