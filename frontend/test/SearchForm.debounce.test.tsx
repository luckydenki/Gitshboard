import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import SearchForm from "../app/components/page/home/SearchForm";

const DEBOUNCE_DELAY = 1_500;
const FAST_INPUT_DELAY = 50;
const SLOW_INPUT_DELAY = 1_600;
const REPEAT_COUNT = 10;
const KEYWORD = "githubuser";

type Measurement = {
    inputEvents: number;
    requestCount: number;
};

type Scenario = {
    name: string;
    baselineCallsPerRun: number;
    run: (input: HTMLInputElement, measure: Measurement) => Promise<void>;
};

let container: HTMLDivElement;
let root: Root;
let fetchMock: ReturnType<typeof vi.fn>;

function setInputValue(input: HTMLInputElement, value: string, measure: Measurement) {
    const valueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;

    if (!valueSetter) throw new Error("Input value setter is unavailable");

    valueSetter.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    measure.inputEvents += 1;
}

async function advanceTime(milliseconds: number) {
    await act(async () => {
        await vi.advanceTimersByTimeAsync(milliseconds);
    });
}

async function renderSearchForm() {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    await act(async () => {
        root.render(
            <MemoryRouter>
                <SearchForm />
            </MemoryRouter>,
        );
    });

    const input = container.querySelector<HTMLInputElement>("input[name='search_name']");

    if (!input) throw new Error("Search input was not rendered");

    return input;
}

async function disposeSearchForm() {
    await act(async () => {
        root.unmount();
    });
    container.remove();
}

async function typeCharacters(
    input: HTMLInputElement,
    value: string,
    measure: Measurement,
    delayAfterEachCharacter: number,
    startLength = 1,
) {
    for (let index = startLength; index <= value.length; index += 1) {
        await act(async () => {
            setInputValue(input, value.slice(0, index), measure);
        });
        await advanceTime(delayAfterEachCharacter);
    }
}

const scenarios: Scenario[] = [
    {
        name: "빠른 연속 입력",
        baselineCallsPerRun: 10,
        run: async (input, measure) => {
            await typeCharacters(input, KEYWORD, measure, FAST_INPUT_DELAY);
        },
    },
    {
        name: "중간 휴지 후 입력",
        baselineCallsPerRun: 10,
        run: async (input, measure) => {
            await typeCharacters(input, KEYWORD.slice(0, 5), measure, FAST_INPUT_DELAY);
            await advanceTime(DEBOUNCE_DELAY);
            await typeCharacters(input, KEYWORD, measure, FAST_INPUT_DELAY, 6);
        },
    },
    {
        name: "느린 입력",
        baselineCallsPerRun: 10,
        run: async (input, measure) => {
            await typeCharacters(input, KEYWORD, measure, SLOW_INPUT_DELAY);
        },
    },
    {
        name: "수정 입력",
        baselineCallsPerRun: 18,
        run: async (input, measure) => {
            await typeCharacters(input, KEYWORD, measure, FAST_INPUT_DELAY);

            for (let length = KEYWORD.length - 1; length >= KEYWORD.length - 4; length -= 1) {
                await act(async () => {
                    setInputValue(input, KEYWORD.slice(0, length), measure);
                });
                await advanceTime(FAST_INPUT_DELAY);
            }

            for (let length = KEYWORD.length - 3; length <= KEYWORD.length; length += 1) {
                await act(async () => {
                    setInputValue(input, KEYWORD.slice(0, length), measure);
                });
                await advanceTime(FAST_INPUT_DELAY);
            }
        },
    },
    {
        name: "붙여넣기",
        baselineCallsPerRun: 1,
        run: async (input, measure) => {
            await act(async () => {
                setInputValue(input, KEYWORD, measure);
            });
        },
    },
    {
        name: "입력 취소",
        baselineCallsPerRun: 10,
        run: async (input, measure) => {
            await typeCharacters(input, KEYWORD, measure, FAST_INPUT_DELAY);
            await act(async () => {
                setInputValue(input, "", measure);
            });
        },
    },
];

beforeEach(() => {
    vi.useFakeTimers();
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
    fetchMock = vi.fn(async () => ({
        json: async () => ({ data: { items: [] } }),
    }));
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "log").mockImplementation(() => undefined);
});

afterEach(async () => {
    if (container?.isConnected) await disposeSearchForm();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe("SearchForm debounce API 호출 측정", () => {
    it("6개 입력 시나리오를 10회씩 실행해 API 호출 절감률을 측정한다", async () => {
        const results: Array<Measurement & { name: string; baselineCalls: number }> = [];

        for (const scenario of scenarios) {
            const measurement: Measurement = { inputEvents: 0, requestCount: 0 };

            for (let attempt = 0; attempt < REPEAT_COUNT; attempt += 1) {
                const input = await renderSearchForm();
                const callsBeforeScenario = fetchMock.mock.calls.length;

                await scenario.run(input, measurement);
                await advanceTime(DEBOUNCE_DELAY);

                measurement.requestCount += fetchMock.mock.calls.length - callsBeforeScenario;
                await disposeSearchForm();
            }

            results.push({
                name: scenario.name,
                inputEvents: measurement.inputEvents,
                requestCount: measurement.requestCount,
                baselineCalls: scenario.baselineCallsPerRun * REPEAT_COUNT,
            });
        }

        expect(results).toEqual([
            { name: "빠른 연속 입력", inputEvents: 100, requestCount: 10, baselineCalls: 100 },
            { name: "중간 휴지 후 입력", inputEvents: 100, requestCount: 20, baselineCalls: 100 },
            { name: "느린 입력", inputEvents: 100, requestCount: 100, baselineCalls: 100 },
            { name: "수정 입력", inputEvents: 180, requestCount: 10, baselineCalls: 180 },
            { name: "붙여넣기", inputEvents: 10, requestCount: 10, baselineCalls: 10 },
            { name: "입력 취소", inputEvents: 110, requestCount: 0, baselineCalls: 100 },
        ]);

        const baselineCalls = results.reduce((total, result) => total + result.baselineCalls, 0);
        const requestCount = results.reduce((total, result) => total + result.requestCount, 0);

        expect(baselineCalls).toBe(590);
        expect(requestCount).toBe(150);
        expect((1 - requestCount / baselineCalls) * 100).toBeCloseTo(74.576, 3);
    });
});
