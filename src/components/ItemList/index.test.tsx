import { ItemList } from ".";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SHORT_LIST_LENGTH, SHOW_ALL_ITEMS_BREAKPOINT } from ".";
import * as itemsData from "./data.mock.json";
import { Item } from "@/types";

const LARGER_SCREEN_SIZE = SHOW_ALL_ITEMS_BREAKPOINT + 100;
const SMALLER_SCREEN_SIZE = SHOW_ALL_ITEMS_BREAKPOINT - 100;
const SHOW_ALL_BUTTON_TEXT = "View all availability";

const queryShowAllButton = async () => {
  return screen.queryByRole("button", { name: SHOW_ALL_BUTTON_TEXT });
};

const items: Item[] = itemsData as Item[];

describe("ItemList component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
    });
  });

  test("renders all items on larger screens without button", async () => {
    await act(async () => {
      window.innerWidth = LARGER_SCREEN_SIZE;
      window.dispatchEvent(new Event("resize"));
    });

    render(<ItemList items={items} />);

    items.forEach((item) => {
      expect(screen.getByText(item.text)).toBeInTheDocument();
    });

    expect(await queryShowAllButton()).not.toBeInTheDocument();
  });

  test("renders only three items on smaller screens along with button", async () => {
    await act(async () => {
      window.innerWidth = SMALLER_SCREEN_SIZE;
      window.dispatchEvent(new Event("resize"));
    });

    render(<ItemList items={items} />);

    items.slice(0, SHORT_LIST_LENGTH).forEach((item) => {
      expect(screen.getByText(item.text)).toBeInTheDocument();
    });

    items.slice(SHORT_LIST_LENGTH).forEach((item) => {
      expect(screen.queryByText(item.text)).toBeNull();
    });

    expect(await queryShowAllButton()).toBeInTheDocument();
  });

  test("button is focusable on smaller screens", async () => {
    await act(async () => {
      window.innerWidth = SMALLER_SCREEN_SIZE;
      window.dispatchEvent(new Event("resize"));
    });

    render(<ItemList items={items} />);

    const button = await queryShowAllButton();
    button!.focus();
    expect(button).toHaveFocus();
  });

  test("shows all items when button is clicked on smaller screens and hides button", async () => {
    const user = userEvent.setup();

    await act(async () => {
      window.innerWidth = SMALLER_SCREEN_SIZE;
      window.dispatchEvent(new Event("resize"));
    });

    render(<ItemList items={items} />);

    items.slice(0, SHORT_LIST_LENGTH).forEach((item) => {
      expect(screen.getByText(item.text)).toBeInTheDocument();
    });

    items.slice(SHORT_LIST_LENGTH).forEach((item) => {
      expect(screen.queryByText(item.text)).toBeNull();
    });

    const button = await queryShowAllButton();
    await user.click(button!);

    items.forEach((item) => {
      expect(screen.getByText(item.text)).toBeInTheDocument();
    });

    expect(screen.queryByText(SHOW_ALL_BUTTON_TEXT)).not.toBeInTheDocument();
  });

  test("hides button and shows all items when resizing from small to large screen", async () => {
    await act(async () => {
      window.innerWidth = SMALLER_SCREEN_SIZE;
      window.dispatchEvent(new Event("resize"));
    });

    const { rerender } = render(<ItemList items={items} />);

    items.slice(0, 3).forEach((item) => {
      expect(screen.getByText(item.text)).toBeInTheDocument();
    });

    items.slice(3).forEach((item) => {
      expect(screen.queryByText(item.text)).toBeNull();
    });

    expect(await queryShowAllButton()).toBeInTheDocument();

    await act(async () => {
      window.innerWidth = LARGER_SCREEN_SIZE;
      window.dispatchEvent(new Event("resize"));
    });

    rerender(<ItemList items={items} />);

    items.forEach((item) => {
      expect(screen.getByText(item.text)).toBeInTheDocument();
    });

    expect(screen.queryByText(SHOW_ALL_BUTTON_TEXT)).not.toBeInTheDocument();
  });

  test("hides items and shows button when resizing from large to small screen", async () => {
    await act(async () => {
      window.innerWidth = LARGER_SCREEN_SIZE;
      window.dispatchEvent(new Event("resize"));
    });

    const { rerender } = render(<ItemList items={items} />);

    items.forEach((item) => {
      expect(screen.getByText(item.text)).toBeInTheDocument();
    });

    expect(screen.queryByText(SHOW_ALL_BUTTON_TEXT)).not.toBeInTheDocument();

    await act(async () => {
      window.innerWidth = SMALLER_SCREEN_SIZE;
      global.dispatchEvent(new Event("resize"));
    });

    rerender(<ItemList items={items} />);

    items.slice(0, SHORT_LIST_LENGTH).forEach((item) => {
      expect(screen.getByText(item.text)).toBeInTheDocument();
    });
    items.slice(SHORT_LIST_LENGTH).forEach((item) => {
      expect(screen.queryByText(item.text)).not.toBeInTheDocument();
    });

    expect(await queryShowAllButton()).toBeInTheDocument();
  });
});
