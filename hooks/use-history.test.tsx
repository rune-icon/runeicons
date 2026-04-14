// @vitest-environment jsdom

import { act, useEffect } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { useHistory } from "./use-history";

type HistoryApi = ReturnType<typeof useHistory<number>>;

let root: Root | null = null;
let container: HTMLDivElement | null = null;

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

function renderHistoryHook(options?: {
  maxHistory?: number;
  enableKeyboardShortcuts?: boolean;
}) {
  let historyApi: HistoryApi | null = null;

  function Harness() {
    const api = useHistory(0, options);

    useEffect(() => {
      historyApi = api;
    }, [api]);

    return null;
  }

  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);

  act(() => {
    root?.render(<Harness />);
  });

  if (!historyApi) {
    throw new Error("History hook did not initialize");
  }

  return {
    get current() {
      if (!historyApi) {
        throw new Error("History hook is unavailable");
      }

      return historyApi;
    },
  };
}

afterEach(() => {
  act(() => {
    root?.unmount();
  });
  root = null;

  container?.remove();
  container = null;

  document.body.innerHTML = "";
});

describe("useHistory keyboard shortcuts", () => {
  it("undoes history when keyboard shortcuts are enabled", () => {
    const history = renderHistoryHook({ maxHistory: 10 });

    act(() => {
      history.current.pushState(1);
    });

    expect(history.current.historyIndex).toBe(1);

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "z",
          ctrlKey: true,
          bubbles: true,
          cancelable: true,
        }),
      );
    });

    expect(history.current.historyIndex).toBe(0);
  });

  it("does not undo history when keyboard shortcuts are disabled", () => {
    const history = renderHistoryHook({
      maxHistory: 10,
      enableKeyboardShortcuts: false,
    });

    act(() => {
      history.current.pushState(1);
    });

    expect(history.current.historyIndex).toBe(1);

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "z",
          ctrlKey: true,
          bubbles: true,
          cancelable: true,
        }),
      );
    });

    expect(history.current.historyIndex).toBe(1);
  });

  it("does not intercept undo while typing in editable fields", () => {
    const history = renderHistoryHook({ maxHistory: 10 });
    const input = document.createElement("input");
    document.body.appendChild(input);

    act(() => {
      history.current.pushState(1);
    });

    expect(history.current.historyIndex).toBe(1);

    act(() => {
      input.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "z",
          ctrlKey: true,
          bubbles: true,
          cancelable: true,
        }),
      );
    });

    expect(history.current.historyIndex).toBe(1);
  });
});
