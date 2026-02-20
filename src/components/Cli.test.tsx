import { describe, expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import {
  Blank,
  Block,
  FooterBar,
  Line,
  Link,
  Panel,
  Poem,
  Select,
  Status,
  StatusDot,
  TitleBar,
  Toggle,
} from "./Cli";

describe("Line", () => {
  it("renders children", async () => {
    render(<Line>Hello world</Line>);
    await expect.element(page.getByText("Hello world")).toBeVisible();
  });

  it("renders prefix", async () => {
    render(
      <Line variant="input" prefix="❯">
        command
      </Line>,
    );
    await expect.element(page.getByText("❯")).toBeVisible();
    await expect.element(page.getByText("command")).toBeVisible();
  });

  it("renders success variant", async () => {
    render(
      <Line variant="success" prefix="✓">
        Done
      </Line>,
    );
    await expect.element(page.getByText("✓")).toBeVisible();
    await expect.element(page.getByText("Done")).toBeVisible();
  });

  it("renders error variant", async () => {
    render(
      <Line variant="error" prefix="✗">
        Failed
      </Line>,
    );
    await expect.element(page.getByText("✗")).toBeVisible();
    await expect.element(page.getByText("Failed")).toBeVisible();
  });
});

describe("Block", () => {
  it("renders children", async () => {
    render(
      <Block>
        <div>Block content</div>
      </Block>,
    );
    await expect.element(page.getByText("Block content")).toBeVisible();
  });
});

describe("TitleBar", () => {
  it("renders title", async () => {
    render(<TitleBar title="My Terminal" />);
    await expect.element(page.getByText("My Terminal")).toBeVisible();
  });

  it("renders children", async () => {
    render(
      <TitleBar title="Terminal">
        <span>Extra</span>
      </TitleBar>,
    );
    await expect.element(page.getByText("Terminal")).toBeVisible();
    await expect.element(page.getByText("Extra")).toBeVisible();
  });

  it("renders without title", async () => {
    render(
      <TitleBar>
        <span>controls</span>
      </TitleBar>,
    );
    await expect.element(page.getByText("controls")).toBeVisible();
  });
});

describe("Panel", () => {
  it("renders children", async () => {
    render(
      <Panel>
        <div>Panel content</div>
      </Panel>,
    );
    await expect.element(page.getByText("Panel content")).toBeVisible();
  });

  it("applies height", async () => {
    render(
      <Panel height={200}>
        <div data-testid="panel-child">Content</div>
      </Panel>,
    );
    await expect.element(page.getByText("Content")).toBeVisible();
  });
});

describe("Link", () => {
  it("renders as anchor with target blank", async () => {
    render(<Link href="https://example.com">Click me</Link>);
    const link = page.getByRole("link", { name: "Click me" });
    await expect.element(link).toBeVisible();
    await expect.element(link).toHaveAttribute("href", "https://example.com");
    await expect.element(link).toHaveAttribute("target", "_blank");
    await expect.element(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});

describe("Blank", () => {
  it("renders an empty spacer", async () => {
    render(
      <div>
        <Blank />
        <span>after blank</span>
      </div>,
    );
    await expect.element(page.getByText("after blank")).toBeVisible();
  });
});

describe("FooterBar", () => {
  it("renders left and right content", async () => {
    render(<FooterBar left={<span>Left</span>} right={<span>Right</span>} />);
    await expect.element(page.getByText("Left")).toBeInTheDocument();
    await expect.element(page.getByText("Right")).toBeVisible();
  });
});

describe("Status", () => {
  it("renders with variant", async () => {
    render(<Status variant="complete">Complete</Status>);
    await expect.element(page.getByText("Complete")).toBeVisible();
  });

  it("renders with error variant", async () => {
    render(<Status variant="error">Error</Status>);
    await expect.element(page.getByText("Error")).toBeVisible();
  });

  it("renders with running variant", async () => {
    render(<Status variant="running">Running</Status>);
    await expect.element(page.getByText("Running")).toBeVisible();
  });
});

describe("StatusDot", () => {
  it("renders children", async () => {
    render(<StatusDot variant="success">Connected</StatusDot>);
    await expect.element(page.getByText("Connected")).toBeVisible();
  });

  it("renders with different variants", async () => {
    render(<StatusDot variant="error">Offline</StatusDot>);
    await expect.element(page.getByText("Offline")).toBeVisible();
  });
});

describe("Select", () => {
  it("renders options", async () => {
    render(
      <Select>
        <Select.Option value="a">Option A</Select.Option>
        <Select.Option value="b">Option B</Select.Option>
        <Select.Option value="c">Option C</Select.Option>
      </Select>,
    );
    await expect.element(page.getByText("Option A")).toBeVisible();
    await expect.element(page.getByText("Option B")).toBeVisible();
    await expect.element(page.getByText("Option C")).toBeVisible();
  });

  it("submits first option by default when pressing Enter", async () => {
    let submitted = "";
    render(
      <Select autoFocus onSubmit={(v) => (submitted = v)}>
        <Select.Option value="a">Option A</Select.Option>
        <Select.Option value="b">Option B</Select.Option>
      </Select>,
    );
    await userEvent.keyboard("{Enter}");
    expect(submitted).toBe("a");
  });

  it("navigates with arrow keys", async () => {
    let submitted = "";
    render(
      <Select autoFocus onSubmit={(v) => (submitted = v)}>
        <Select.Option value="a">Option A</Select.Option>
        <Select.Option value="b">Option B</Select.Option>
      </Select>,
    );
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Enter}");
    expect(submitted).toBe("b");
  });
});

describe("Toggle", () => {
  it("renders options horizontally", async () => {
    render(
      <Toggle>
        <Toggle.Option value="x">X</Toggle.Option>
        <Toggle.Option value="y">Y</Toggle.Option>
      </Toggle>,
    );
    await expect.element(page.getByText("X")).toBeVisible();
    await expect.element(page.getByText("Y")).toBeVisible();
  });

  it("calls onSubmit on Enter", async () => {
    let submitted = "";
    render(
      <Toggle autoFocus onSubmit={(v) => (submitted = v)}>
        <Toggle.Option value="go">Go</Toggle.Option>
      </Toggle>,
    );
    await userEvent.keyboard("{Enter}");
    expect(submitted).toBe("go");
  });

  it("calls onSubmit on click", async () => {
    let submitted = "";
    render(
      <Toggle onSubmit={(v) => (submitted = v)}>
        <Toggle.Option value="click-me">Click me</Toggle.Option>
      </Toggle>,
    );
    await page.getByText("Click me").click();
    expect(submitted).toBe("click-me");
  });
});

describe("Poem.joinWords", () => {
  it("joins words with spaces", () => {
    expect(Poem.joinWords(["Hello", "world"])).toBe("Hello world");
  });

  it("handles newlines", () => {
    expect(Poem.joinWords(["Hello", "\\n", "world"])).toBe("Hello\nworld");
  });

  it("handles empty array", () => {
    expect(Poem.joinWords([])).toBe("");
  });

  it("handles consecutive newlines", () => {
    expect(Poem.joinWords(["A", "\\n", "\\n", "B"])).toBe("A\n\nB");
  });

  it("no leading space after newline", () => {
    expect(Poem.joinWords(["\\n", "word"])).toBe("\nword");
  });
});

describe("Poem.Display", () => {
  it("renders title and text", async () => {
    render(<Poem.Display title="My Poem" author="Author" text="Line one" />);
    await expect.element(page.getByText("My Poem")).toBeVisible();
    await expect.element(page.getByText("— Author")).toBeVisible();
    await expect.element(page.getByText("Line one")).toBeVisible();
  });

  it("renders streaming cursor", async () => {
    render(<Poem.Display text="Streaming..." streaming />);
    await expect.element(page.getByText("▌")).toBeVisible();
  });

  it("hides cursor when not streaming", async () => {
    render(<Poem.Display text="Done" />);
    await expect.element(page.getByText("Done")).toBeVisible();
    expect(page.getByText("▌").elements().length).toBe(0);
  });
});
