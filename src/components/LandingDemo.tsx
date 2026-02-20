"use client";

import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import type { Address } from "viem";
import { tempoModerato } from "viem/chains";
import { useConnectorClient } from "wagmi";
import { fetch } from "../mppx.client";
import { pathUsd } from "../wagmi.config";
import * as Cli from "./Cli";

export function LandingDemo({ token = pathUsd }: { token?: Address }) {
  useEffect(() => {
    Cli.store.setState((s) => ({ ...s, restartStep: 1 }));
  }, []);

  return (
    <Cli.Window token={token}>
      <Cli.TitleBar title="agent-demo">
        <Cli.Account />
        <Cli.Refresh />
      </Cli.TitleBar>

      <Cli.Demo.Content height={337}>
        <Cli.Startup />
        <Cli.ConnectWallet />
        <Cli.Faucet />
        <SelectQuery />
      </Cli.Demo.Content>

      <Cli.FooterBar
        left={<Cli.Hint />}
        right={
          <>
            <Cli.Balance />
            <Cli.Spent />
          </>
        }
      />
    </Cli.Window>
  );
}

// ---------------------------------------------------------------------------
// Types & data
// ---------------------------------------------------------------------------

type ApiCall = {
  description: string;
  endpoint: string;
  name: string;
  params?: Record<string, string>;
  price: string;
};

type QueryPreset = {
  calls: ApiCall[];
  id: string;
  imageUrl?: string;
  label: string;
  prompt: string;
  response: string | string[];
};

const presets: QueryPreset[] = [
  {
    calls: [
      {
        description: "Generate random image",
        endpoint: "/api/agent/image",
        name: "image.generate",
        price: "$0.01",
      },
    ],
    id: "image",
    imageUrl: "https://picsum.photos/256/256",
    label: "Image",
    prompt: "Generate random image",
    response: "",
  },
  {
    calls: [
      {
        description: "Generate ASCII art",
        endpoint: "/api/agent/search",
        name: "ascii.generate",
        price: "$0.005",
      },
    ],
    id: "ascii",
    label: "ASCII",
    prompt: "Get ASCII drawing",
    response: [
      '"    /\\_/\\\n   ( o.o )\n    > ^ <\n   /|   |\\\n  (_|   |_)"',
      '"    ___\n   |o_o|\n   |:_/|\n  //   \\ \\\n (|     |)\n/\'\\_   _/`\\\n\\___)=(___/"',
      '"   __\n  / _)\n ( (\n  > >\n / /\n/ /\n\\_)\n/_/"',
      '"  .---.\n |[x x]|\n  |   |\n  |   |\n _|   |_\n|_______|"',
      '"   *\n  /|\\\n / | \\\n/  |  \\\n  /|\\\n /|||\\\n/_|||_\\\n  |_|"',
      '"  ____\n /    \\\n| (o)(o)\n|   >  |\n|  \\_/ |\n \\____/"',
    ],
  },
  {
    calls: [
      {
        description: "Select poem style and theme",
        endpoint: "/api/agent/location",
        name: "poem.plan",
        price: "$0.001",
      },
      {
        description: "Generate poem",
        endpoint: "/api/agent/search",
        name: "poem.generate",
        price: "$0.005",
      },
    ],
    id: "poem",
    label: "Poem",
    prompt: "Write a poem",
    response: [
      '"Electric thoughts in silicon streams,\nA wallet opens, pays for dreams.\nNo banks, no gates — just keys that sign,\nMicropayments, one cent at a time."',
      '"Pay as you go,\nNo monthly fee, no contract signed,\nJust value exchanged at the edge of a request.\n\nA fraction of a cent — barely a thought,\nBut enough to keep the servers warm,\nThe models fed, the APIs alive.\n\nThis is how it works now:\nYou ask, you pay, you receive.\nNo middleman, no permission slip,\nJust cryptographic proof that you were here."',
      '"A single cent unlocks the gate,\nNo subscription, no monthly rate.\n\nThe machine reads, the wallet signs,\nValue flows through protocol lines.\nEach request a tiny exchange —\nPermissionless, automatic, strange.\n\nWhat once was free now finds its price,\nWhat once was walled now pays in slice."',
      '"A penny signed and sent,\nThrough wires, no walls, no rent —\nValue, well-spent."',
      '"Keys turn in the dark,\nSilent ledgers sign the spark —\nCents leave their small mark."',
      '"No gate, no gatekeeper,\nJust a hash and a heartbeat —\nAccess by the cent."',
    ],
  },
];

// ---------------------------------------------------------------------------
// SelectQuery
// ---------------------------------------------------------------------------

function SelectQuery() {
  const { data: client } = useConnectorClient();

  const [revealing, setRevealing] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const streamDoneRef = useRef<(() => void) | null>(null);
  const lastResponseRef = useRef<string | null>(null);
  const [results, setResults] = useState<
    {
      calls: (ApiCall & { txHash?: string })[];
      query: QueryPreset & { response: string };
      status: "pending" | "done" | "error";
    }[]
  >([]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (queryId: string) => {
      const preset = presets.find((q) => q.id === queryId);
      if (!preset) throw new Error("Unknown query");

      let response: string;
      if (Array.isArray(preset.response)) {
        const options = preset.response.filter(
          (r) => r !== lastResponseRef.current,
        );
        response = options[Math.floor(Math.random() * options.length)];
      } else {
        response = preset.response;
      }
      lastResponseRef.current = response;
      const query = { ...preset, response };

      const index = results.length;
      setResults((r) => [...r, { calls: [], query, status: "pending" }]);

      for (const call of query.calls) {
        const url = new URL(call.endpoint, window.location.origin);
        if (call.params)
          for (const [key, value] of Object.entries(call.params))
            url.searchParams.set(key, value);

        setResults((r) =>
          r.map((item, i) =>
            i === index ? { ...item, calls: [...item.calls, call] } : item,
          ),
        );

        const res = await fetch(url.toString(), {
          context: { account: client?.account },
        });

        let txHash: string | undefined;
        try {
          const header = res.headers.get("Payment-Receipt");
          if (header) {
            const json = atob(header.replace(/-/g, "+").replace(/_/g, "/"));
            const parsed = JSON.parse(json) as {
              reference?: string;
              txHash?: string;
            };
            txHash = parsed.txHash ?? parsed.reference;
          }
        } catch {}

        if (txHash) {
          setResults((r) =>
            r.map((item, i) => {
              if (i !== index) return item;
              const calls = [...item.calls];
              calls[calls.length - 1] = { ...calls[calls.length - 1], txHash };
              return { ...item, calls };
            }),
          );
        }

        await new Promise((r) => setTimeout(r, 800));
      }

      setResults((r) =>
        r.map((item, i) => (i === index ? { ...item, status: "done" } : item)),
      );

      if (query.imageUrl) {
        setRevealing(true);
        await new Promise((r) =>
          setTimeout(r, blurSteps.length * stepInterval),
        );
        setRevealing(false);
      } else if (query.response) {
        setStreaming(true);
        await new Promise<void>((resolve) => {
          streamDoneRef.current = resolve;
        });
        setStreaming(false);
      } else {
        await new Promise((r) => setTimeout(r, 1000));
      }
    },
    onError: () => {
      setResults((r) => {
        const last = r.length - 1;
        return r.map((item, i) =>
          i === last ? { ...item, status: "error" } : item,
        );
      });
    },
  });

  return (
    <>
      {results.map((result, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: stable list
        <QueryResult
          key={i}
          {...result}
          onStreamComplete={() => {
            streamDoneRef.current?.();
            streamDoneRef.current = null;
          }}
        />
      ))}
      {!isPending && !revealing && !streaming && (
        <Cli.Block>
          <Cli.Line variant="info">Select a query to run:</Cli.Line>
          <Cli.Select autoFocus onSubmit={(v) => mutate(v)}>
            {presets.map((query) => (
              <Cli.Select.Option key={query.id} value={query.id}>
                {query.prompt}
              </Cli.Select.Option>
            ))}
          </Cli.Select>
        </Cli.Block>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// QueryResult
// ---------------------------------------------------------------------------

function QueryResult({
  calls,
  onStreamComplete,
  query,
  status,
}: {
  calls: (ApiCall & { txHash?: string })[];
  onStreamComplete?: () => void;
  query: QueryPreset & { response: string };
  status: "pending" | "done" | "error";
}) {
  const explorerUrl = tempoModerato.blockExplorers.default.url;
  return (
    <Cli.Block>
      <Cli.Line variant="input" prefix="❯">
        agent.query("{query.prompt}")
      </Cli.Line>
      <Cli.Line variant="info">
        Planning: {query.calls.length} API calls, ~$
        {query.calls
          .reduce((sum, c) => sum + Number.parseFloat(c.price.slice(1)), 0)
          .toFixed(3)}{" "}
        total
      </Cli.Line>
      <Cli.Blank />
      {calls.map((call, i) => (
        <div key={call.name}>
          <Cli.Line variant="warning" prefix="→">
            [{i + 1}/{query.calls.length}] {call.name} — {call.price}
          </Cli.Line>
          {i === calls.length - 1 && status === "pending" ? (
            <Cli.Line variant="loading">{call.description}...</Cli.Line>
          ) : (
            <>
              <Cli.Line variant="success" prefix="✓">
                {call.description}
              </Cli.Line>
              {call.txHash && (
                <Cli.Line variant="info">
                  {"  "}tx:{" "}
                  <Cli.Link
                    href={`${explorerUrl}/tx/${call.txHash}`}
                    className="inline"
                  >
                    {call.txHash.slice(0, 10)}…{call.txHash.slice(-8)}
                  </Cli.Link>
                </Cli.Line>
              )}
            </>
          )}
        </div>
      ))}
      {status === "done" && (
        <>
          <Cli.Blank />
          <Cli.Line variant="success" prefix="✓">
            Complete — {query.calls.length} calls
          </Cli.Line>
          {query.response && (
            <>
              <Cli.Blank />
              <Cli.Line className="whitespace-pre-wrap">
                <StreamingText
                  text={query.response}
                  speed={15}
                  onComplete={onStreamComplete}
                />
              </Cli.Line>
            </>
          )}
          {query.imageUrl && (
            <>
              <Cli.Blank />
              <ProgressiveImage src={query.imageUrl} />
            </>
          )}
        </>
      )}
      {status === "error" && (
        <>
          <Cli.Blank />
          <Cli.Line variant="error" prefix="✗">
            Query failed
          </Cli.Line>
        </>
      )}
    </Cli.Block>
  );
}

// ---------------------------------------------------------------------------
// StreamingText
// ---------------------------------------------------------------------------

export function StreamingText({
  onComplete,
  speed = 5,
  text,
}: {
  onComplete?: () => void;
  speed?: number;
  text: string;
}) {
  const [charCount, setCharCount] = useState(0);
  const completedRef = useRef(false);

  useEffect(() => {
    if (charCount >= text.length) {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete?.();
      }
      return;
    }
    const timer = setTimeout(() => setCharCount((c) => c + 1), speed);
    return () => clearTimeout(timer);
  }, [charCount, text.length, speed, onComplete]);

  return <>{text.slice(0, charCount)}</>;
}

// ---------------------------------------------------------------------------
// ProgressiveImage
// ---------------------------------------------------------------------------

const blurSteps = [10, 7, 4, 1, 0] as const;
const stepInterval = 1250; // 5s / 4 transitions

function ProgressiveImage({ src }: { src: string }) {
  const [seed] = useState(() => Math.random().toString(36).slice(2, 8));
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= blurSteps.length - 1) return;
    const timer = setTimeout(() => setStep((s) => s + 1), stepInterval);
    return () => clearTimeout(timer);
  }, [step]);

  const blur = blurSteps[step];
  const grayscale = step === 0;
  const seededSrc = src.replace("/256/256", `/seed/${seed}/256/256`);
  const params = [
    ...(blur ? [`blur=${blur}`] : []),
    ...(grayscale ? ["grayscale"] : []),
  ];
  const currentSrc = params.length
    ? `${seededSrc}?${params.join("&")}`
    : seededSrc;

  return <img src={currentSrc} alt="Generated image" className="w-32 h-32" />;
}
