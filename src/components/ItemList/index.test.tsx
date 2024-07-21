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

test("allows user to see entire list on large screen, and only a part of the list on smaller screen along with a button", () => {
  // initialize the screen to large size first
  fireEvent.resize(window, {
    target: { innerWidth: LARGER_SCREEN_SIZE },
  });

  // render the component
  const { items } = renderComponent();

  // check if entire list is shown
  for (const item of items) {
    expect(screen.getByText(new RegExp(item.text)));
  }

  // make sure button is not visible
  expect(
    screen.queryByRole("button", { name: SHOW_ALL_BUTTON_TEXT })
  ).not.toBeInTheDocument();

  // resize the screen to small size
  fireEvent.resize(window, {
    target: { innerWidth: SMALLER_SCREEN_SIZE },
  });

  // check if only part of list is visible
  for (const item of items.slice(0, SHORT_LIST_LENGTH)) {
    expect(screen.getByText(new RegExp(item.text))).toBeInTheDocument();
  }

  for (const item of items.slice(SHORT_LIST_LENGTH)) {
    expect(screen.queryByText(new RegExp(item.text))).not.toBeInTheDocument();
  }

  // check if button is visible
  const button = screen.getByRole("button", { name: SHOW_ALL_BUTTON_TEXT });
  expect(button).toBeInTheDocument();

  // resize the screen to large size again
  fireEvent.resize(window, {
    target: { innerWidth: LARGER_SCREEN_SIZE },
  });

  // check again if entire list is visible
  for (const item of items) {
    expect(screen.getByText(new RegExp(item.text)));
  }

  // check again if button is not visible
  expect(button).not.toBeInTheDocument();
});

test("clicking the button allows user to always see the entire list on small screen", async () => {
  const user = userEvent.setup();

  // initialize the screen to small size
  fireEvent.resize(window, {
    target: { innerWidth: SMALLER_SCREEN_SIZE },
  });

  // render the component
  const { items } = renderComponent();

  // check if only part of list is visible
  for (const item of items.slice(0, SHORT_LIST_LENGTH)) {
    expect(screen.getByText(new RegExp(item.text))).toBeInTheDocument();
  }

  for (const item of items.slice(SHORT_LIST_LENGTH)) {
    expect(screen.queryByText(new RegExp(item.text))).not.toBeInTheDocument();
  }

  // check if button is visible
  const button = screen.getByRole("button", { name: SHOW_ALL_BUTTON_TEXT });
  expect(button).toBeInTheDocument();

  // click the button
  await user.click(button);

  // check if user can now see entire list
  for (const item of items) {
    expect(screen.getByText(new RegExp(item.text))).toBeInTheDocument();
  }

  // check if button is no longer visible
  expect(button).not.toBeInTheDocument();

  // resize to large screen
  fireEvent.resize(window, {
    target: { innerWidth: LARGER_SCREEN_SIZE },
  });

  // check if user can see entire list
  for (const item of items) {
    expect(screen.getByText(new RegExp(item.text))).toBeInTheDocument();
  }

  // resize back to small screen
  fireEvent.resize(window, {
    target: { innerWidth: SMALLER_SCREEN_SIZE },
  });

  // check if user can still see entire list
  for (const item of items) {
    expect(screen.getByText(new RegExp(item.text))).toBeInTheDocument();
  }

  // check if button is not visible
  expect(button).not.toBeInTheDocument();
});
