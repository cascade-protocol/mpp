import { QueryClient } from "@tanstack/react-query";
import { tempoModerato } from "viem/chains";
import { createConfig, webSocket } from "wagmi";
import { dangerous_secp256k1 } from "wagmi/tempo";

export const pathUsd =
  "0x20c0000000000000000000000000000000000000" as `0x${string}`;

export const queryClient = new QueryClient();

const chain = tempoModerato.extend({ feeToken: pathUsd });

export const config = createConfig({
  connectors: [dangerous_secp256k1()],
  chains: [chain],
  multiInjectedProviderDiscovery: false,
  pollingInterval: 1_000,
  transports: {
    [tempoModerato.id]: webSocket(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
