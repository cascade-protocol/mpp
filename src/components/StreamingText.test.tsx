import { expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";
import { StreamingText } from "./LandingDemo";

test("streams text character by character", async () => {
  const text = "hello";
  render(<StreamingText text={text} speed={10} />);

  // Starts empty
  await expect.element(page.getByText("hello")).not.toBeInTheDocument();

  // Eventually shows full text
  await expect
    .element(page.getByText("hello"), { timeout: 5_000 })
    .toBeVisible();
});

test("calls onComplete after streaming finishes", async () => {
  const onComplete = vi.fn();
  const text = "hi";
  render(<StreamingText text={text} speed={10} onComplete={onComplete} />);

  await expect.element(page.getByText("hi"), { timeout: 5_000 }).toBeVisible();

  await expect.poll(() => onComplete).toHaveBeenCalledOnce();
});

test("calls onComplete immediately for empty text", async () => {
  const onComplete = vi.fn();
  render(<StreamingText text="" speed={10} onComplete={onComplete} />);

  await expect.poll(() => onComplete).toHaveBeenCalledOnce();
});
