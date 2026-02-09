import { type Address, type Client, isAddressEqual, type Account as viem_Account } from 'viem'

export type Account = viem_Account

export function getResolver(parameters: getResolver.Parameters = {}) {
  const { account: defaultAccount } = parameters

  return (
    client: Client,
    { account: override }: { account?: Account | Address | undefined } = {},
  ): Account => {
    const account = override ?? defaultAccount

    if (!account) {
      if (!client.account)
        throw new Error('No `account` provided. Pass `account` to parameters or context.')
      return client.account
    }

    if (typeof account === 'string') {
      // TODO: remove once JSON-RPC account is supported.
      if (!client.account)
        throw new Error(
          `Address "${account}" was provided but the client does not have an account.`,
        )
      // TODO: remove once JSON-RPC account is supported.
      if (!isAddressEqual(client.account.address, account))
        throw new Error(
          `Address "${account}" does not match the client account "${client.account.address}".`,
        )
      return client.account
    }

    return account
  }
}

export declare namespace getResolver {
  type Parameters = {
    /** Account to use for signing. If an Address is provided, it must match the client's account. */
    account?: Account | Address | undefined
  }
}
