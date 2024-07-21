import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ItemList } from ".";
import { SHORT_LIST_LENGTH, SHOW_ALL_ITEMS_BREAKPOINT } from ".";
import * as itemsData from "./data.mock.json";
import { Item } from "@/types";

const LARGER_SCREEN_SIZE = SHOW_ALL_ITEMS_BREAKPOINT + 100;
const SMALLER_SCREEN_SIZE = SHOW_ALL_ITEMS_BREAKPOINT - 100;
const SHOW_ALL_BUTTON_TEXT = "View all availability";

function renderComponent() {
  const items: Item[] = structuredClone(itemsData) as Item[];

  render(<ItemList items={items} />);

  return {
    items,
  };
}

test("renders all items on larger screens without button", async () => {
  fireEvent.resize(window, {
    target: { innerWidth: LARGER_SCREEN_SIZE },
  });

  const { items } = renderComponent();

  for (const item of items) {
    expect(screen.getByText(item.text)).toBeInTheDocument();
  }

  expect(
    screen.queryByRole("button", { name: SHOW_ALL_BUTTON_TEXT })
  ).not.toBeInTheDocument();
});

test("renders only the three first items on smaller screens along with button", async () => {
  fireEvent.resize(window, {
    target: { innerWidth: SMALLER_SCREEN_SIZE },
  });

  const { items } = renderComponent();

  for (const item of items.slice(0, SHORT_LIST_LENGTH)) {
    expect(screen.getByText(item.text)).toBeInTheDocument();
  }

  for (const item of items.slice(SHORT_LIST_LENGTH)) {
    expect(screen.queryByText(item.text)).not.toBeInTheDocument();
  }

  expect(
    screen.getByRole("button", { name: SHOW_ALL_BUTTON_TEXT })
  ).toBeInTheDocument();
});

test("button rendered on smaller screens is focusable", async () => {
  fireEvent.resize(window, {
    target: { innerWidth: SMALLER_SCREEN_SIZE },
  });

  renderComponent();

  const button = screen.getByRole("button", { name: SHOW_ALL_BUTTON_TEXT });

  button.focus();
  expect(button).toHaveFocus();
});

test("shows all items when button is clicked on smaller screens and hides button", async () => {
  const user = userEvent.setup();

  fireEvent.resize(window, {
    target: { innerWidth: SMALLER_SCREEN_SIZE },
  });

  const { items } = renderComponent();

  for (const item of items.slice(0, SHORT_LIST_LENGTH)) {
    expect(screen.getByText(item.text)).toBeInTheDocument();
  }

  for (const item of items.slice(SHORT_LIST_LENGTH)) {
    expect(screen.queryByText(item.text)).not.toBeInTheDocument();
  }

  const button = screen.getByRole("button", { name: SHOW_ALL_BUTTON_TEXT });
  await user.click(button);

  for (const item of items) {
    expect(screen.getByText(item.text)).toBeInTheDocument();
  }

  expect(button).not.toBeInTheDocument();
});

test("hides button and shows all items when resizing from small to large screen", async () => {
  fireEvent.resize(window, {
    target: { innerWidth: SMALLER_SCREEN_SIZE },
  });

  const { items } = renderComponent();

  for (const item of items.slice(0, SHORT_LIST_LENGTH)) {
    expect(screen.getByText(item.text)).toBeInTheDocument();
  }

  for (const item of items.slice(SHORT_LIST_LENGTH)) {
    expect(screen.queryByText(item.text)).not.toBeInTheDocument();
  }

  const button = screen.getByRole("button", { name: SHOW_ALL_BUTTON_TEXT });
  expect(button).toBeInTheDocument();

  fireEvent.resize(window, {
    target: { innerWidth: LARGER_SCREEN_SIZE },
  });

  for (const item of items) {
    expect(screen.getByText(item.text)).toBeInTheDocument();
  }

  expect(button).not.toBeInTheDocument();
});

test("hides items and shows button when resizing from large to small screen", async () => {
  fireEvent.resize(window, {
    target: { innerWidth: LARGER_SCREEN_SIZE },
  });

  const { items } = renderComponent();

  for (const item of items) {
    expect(screen.getByText(item.text)).toBeInTheDocument();
  }

  expect(
    screen.queryByRole("button", { name: SHOW_ALL_BUTTON_TEXT })
  ).not.toBeInTheDocument();

  fireEvent.resize(window, {
    target: { innerWidth: SMALLER_SCREEN_SIZE },
  });

  for (const item of items.slice(0, SHORT_LIST_LENGTH)) {
    expect(screen.getByText(item.text)).toBeInTheDocument();
  }

  for (const item of items.slice(SHORT_LIST_LENGTH)) {
    expect(screen.queryByText(item.text)).not.toBeInTheDocument();
  }

  expect(
    screen.getByRole("button", { name: SHOW_ALL_BUTTON_TEXT })
  ).toBeInTheDocument();
});
