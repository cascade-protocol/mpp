import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { beforeEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";
import { WagmiProvider } from "wagmi";
import { config, queryClient } from "../wagmi.config";
import { store } from "./Cli";
import { LandingDemo } from "./LandingDemo";

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

beforeEach(() => {
  store.setState(() => ({
    initialBalance: undefined,
    interaction: null,
    restartStep: 0,
    sessionDeposit: 0n,
    sessionSpent: 0n,
    stepIndex: 0,
    token: undefined,
    view: "main",
  }));
  queryClient.clear();
});

test("renders title bar", async () => {
  render(
    <Wrapper>
      <LandingDemo />
    </Wrapper>,
  );
  await expect.element(page.getByText("agent-demo")).toBeVisible();
});

test("shows Startup version line then ConnectWallet", async () => {
  render(
    <Wrapper>
      <LandingDemo />
    </Wrapper>,
  );
  await expect.element(page.getByText(/mpp\.sh@test/)).toBeVisible();
  await expect.element(page.getByText("Sign up")).toBeVisible();
  await expect.element(page.getByText("Sign in")).toBeVisible();
});

test("does not show SelectQuery before wallet connects", async () => {
  render(
    <Wrapper>
      <LandingDemo />
    </Wrapper>,
  );
  await expect.element(page.getByText("Sign up")).toBeVisible();
  expect(page.getByText("Select a query to run:").elements().length).toBe(0);
});

test("connects wallet on Sign up click", async () => {
  render(
    <Wrapper>
      <LandingDemo />
    </Wrapper>,
  );

  await expect.element(page.getByText("Sign up")).toBeVisible();
  await page.getByText("Sign up").click();

  // ConnectWallet disappears after connecting
  await expect
    .element(page.getByText("Sign up"), { timeout: 15_000 })
    .not.toBeInTheDocument();
  // stepIndex advances past ConnectWallet
  await expect.poll(() => store.state.stepIndex).toBeGreaterThanOrEqual(2);
}, 20_000);

test("skips faucet when wallet already has balance", async () => {
  render(
    <Wrapper>
      <LandingDemo />
    </Wrapper>,
  );

  await expect.element(page.getByText("Sign up")).toBeVisible();
  await page.getByText("Sign up").click();

  // Wait for wallet to connect (ConnectWallet disappears)
  await expect
    .element(page.getByText("Sign up"), { timeout: 15_000 })
    .not.toBeInTheDocument();

  // Set positive balance before Faucet step becomes visible
  store.setState((s) => ({ ...s, initialBalance: 1_000_000n }));

  // Faucet detects existing balance, skips funding, advances to SelectQuery
  await expect
    .element(page.getByText("Select a query to run:"), { timeout: 15_000 })
    .toBeVisible();
  expect(page.getByText("Funding wallet...").elements().length).toBe(0);
}, 20_000);

test("funds wallet via faucet when balance is zero", async () => {
  render(
    <Wrapper>
      <LandingDemo />
    </Wrapper>,
  );

  await expect.element(page.getByText("Sign up")).toBeVisible();
  await page.getByText("Sign up").click();

  // Faucet funds the new wallet and advances to SelectQuery
  await expect
    .element(page.getByText("Select a query to run:"), { timeout: 30_000 })
    .toBeVisible();
  await expect.element(page.getByText("Generate random image")).toBeVisible();
  await expect.element(page.getByText("Get ASCII drawing")).toBeVisible();
  await expect.element(page.getByText("Write a poem")).toBeVisible();
}, 45_000);

test("streams poem and shows select prompt after completion", async () => {
  render(
    <Wrapper>
      <LandingDemo />
    </Wrapper>,
  );

  // Connect and fund
  await expect.element(page.getByText("Sign up")).toBeVisible();
  await page.getByText("Sign up").click();
  await expect
    .element(page.getByText("Select a query to run:"), { timeout: 30_000 })
    .toBeVisible();

  // Select "Write a poem"
  await page.getByText("Write a poem").click();

  // Planning line appears
  await expect
    .element(page.getByText(/Planning: 2 API calls/), { timeout: 10_000 })
    .toBeVisible();

  // Select prompt hidden while streaming
  await expect
    .element(page.getByText("Complete — 2 calls"), { timeout: 30_000 })
    .toBeVisible();

  // Select prompt reappears after stream finishes
  await expect
    .element(page.getByText("Select a query to run:"), { timeout: 10_000 })
    .toBeVisible();
}, 60_000);

test("renders image after Generate random image query completes", async () => {
  render(
    <Wrapper>
      <LandingDemo />
    </Wrapper>,
  );

  // Connect and fund
  await expect.element(page.getByText("Sign up")).toBeVisible();
  await page.getByText("Sign up").click();
  await expect
    .element(page.getByText("Select a query to run:"), { timeout: 30_000 })
    .toBeVisible();

  // Select "Generate random image"
  await page.getByText("Generate random image").click();

  // Image should render after query completes
  await expect
    .element(page.getByRole("img", { name: "Generated image" }), {
      timeout: 30_000,
    })
    .toBeVisible();
}, 60_000);
