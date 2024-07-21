import { throttle } from "./throttle";

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe("throttle", () => {
  it("should call the function immediately if not throttled", () => {
    const fn = jest.fn();
    const throttledFn = throttle(fn, 100);

    throttledFn();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should not call the function again before the wait time is over", () => {
    const fn = jest.fn();
    const throttledFn = throttle(fn, 100);

    throttledFn();
    throttledFn();
    expect(fn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(50);
    throttledFn();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should call the function again after the wait time is over", () => {
    const fn = jest.fn();
    const throttledFn = throttle(fn, 100);

    throttledFn();
    expect(fn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(100);
    throttledFn();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("should throttle calls correctly over multiple intervals", () => {
    const fn = jest.fn();
    const throttledFn = throttle(fn, 100);

    throttledFn();
    expect(fn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(100);
    throttledFn();
    expect(fn).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(100);
    throttledFn();
    expect(fn).toHaveBeenCalledTimes(3);

    jest.advanceTimersByTime(50);
    throttledFn();
    expect(fn).toHaveBeenCalledTimes(3);

    jest.advanceTimersByTime(50);
    throttledFn();
    expect(fn).toHaveBeenCalledTimes(4);
  });
});
