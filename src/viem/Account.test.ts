import { createClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'
import { describe, expect, test } from 'vitest'
import * as Account from './Account.js'

const account = privateKeyToAccount(
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
)

const otherAccount = privateKeyToAccount(
  '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
)

const clientWithAccount = createClient({
  account,
  chain: mainnet,
  transport: http(),
})

const clientWithoutAccount = createClient({
  chain: mainnet,
  transport: http(),
})

describe('getResolver', () => {
  test('behavior: returns Account when passed as default', () => {
    const getAccount = Account.getResolver({ account })
    const result = getAccount(clientWithoutAccount)
    expect(result).toBe(account)
  })

  test('behavior: returns Account when passed as override', () => {
    const getAccount = Account.getResolver()
    const result = getAccount(clientWithoutAccount, { account: otherAccount })
    expect(result).toBe(otherAccount)
  })

  test('behavior: override takes precedence over default', () => {
    const getAccount = Account.getResolver({ account })
    const result = getAccount(clientWithoutAccount, { account: otherAccount })
    expect(result).toBe(otherAccount)
  })

  test('behavior: falls back to client.account when no account provided', () => {
    const getAccount = Account.getResolver()
    const result = getAccount(clientWithAccount)
    expect(result).toBe(account)
  })

  test('behavior: Address matching client.account returns client.account', () => {
    const getAccount = Account.getResolver()
    const result = getAccount(clientWithAccount, { account: account.address })
    expect(result).toBe(account)
  })

  test('behavior: Address as default matching client.account returns client.account', () => {
    const getAccount = Account.getResolver({ account: account.address })
    const result = getAccount(clientWithAccount)
    expect(result).toBe(account)
  })

  test('error: throws when no account and client has no account', () => {
    const getAccount = Account.getResolver()
    expect(() => getAccount(clientWithoutAccount)).toThrowErrorMatchingInlineSnapshot(
      `[Error: No \`account\` provided. Pass \`account\` to parameters or context.]`,
    )
  })

  test('error: throws when Address provided but client has no account', () => {
    const getAccount = Account.getResolver()
    expect(() =>
      getAccount(clientWithoutAccount, { account: account.address }),
    ).toThrowErrorMatchingInlineSnapshot(
      `[Error: Address "${account.address}" was provided but the client does not have an account.]`,
    )
  })

  test('error: throws when Address does not match client.account', () => {
    const getAccount = Account.getResolver()
    expect(() =>
      getAccount(clientWithAccount, { account: otherAccount.address }),
    ).toThrowErrorMatchingInlineSnapshot(
      `[Error: Address "${otherAccount.address}" does not match the client account "${account.address}".]`,
    )
  })
})
