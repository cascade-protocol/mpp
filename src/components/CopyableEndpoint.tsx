"use client";

import { useCallback, useRef, useState } from "react";

export function CopyableEndpoint({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const copy = useCallback(() => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 2000);
  }, [value]);

  return (
    <button
      type="button"
      onClick={copy}
      className="endpoint-copyable font-mono text-[0.875em] rounded px-1.5 py-0.5 border border-transparent transition-colors cursor-pointer text-left w-fit min-w-0"
      style={{
        background: "var(--background-color-inline-code)",
        color: "var(--vocs-text-color-heading)",
        fontFamily: "var(--font-mono)",
      }}
      aria-label={`Copy ${value} to clipboard`}
      title="Copy to clipboard"
    >
      {copied ? "Copied!" : value}
    </button>
  );
}
