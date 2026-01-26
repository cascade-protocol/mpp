import { Base64 } from 'ox'

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
export type Credential<payload = unknown> = {
  /** The challenge ID from the original 402 response */
  id: string
  /** Optional payer identifier as a DID (e.g., "did:pkh:eip155:1:0x...") */
  source?: string | undefined
  /** The validated credential payload */
  payload: payload
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
  return JSON.parse(json)
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
