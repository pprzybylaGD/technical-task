import { useEffect, useState } from "react";
import { throttle } from "@/utils/throttle";
import { ItemElement } from "../ItemElement";
import { Item } from "@/types";
import "./styles.scss";

interface Props {
  items: Item[];
}

export const SHORT_LIST_LENGTH = 3;
export const SHOW_ALL_ITEMS_BREAKPOINT = 920;

export const ItemList = ({ items }: Props) => {
  const [listState, setListState] = useState<
    "defaultWide" | "extended" | "defaultSmall"
  >(
    window.innerWidth >= SHOW_ALL_ITEMS_BREAKPOINT
      ? "defaultWide"
      : "defaultSmall"
  );

  const handleButtonClick = () => {
    setListState("extended");
  };

  useEffect(() => {
    const handleResize = () => {
      if (listState === "extended") {
        return;
      }

      if (window.innerWidth >= SHOW_ALL_ITEMS_BREAKPOINT) {
        setListState("defaultWide");
        return;
      }

      setListState("defaultSmall");
    };

    const throttledHandleResize = throttle(handleResize, 50);

    window.addEventListener("resize", throttledHandleResize);

    return () => window.removeEventListener("resize", throttledHandleResize);
  }, [listState]);

  return (
    <div className="item-list">
      <ul className="item-list__list">
        {(listState === "defaultSmall"
          ? items.slice(0, SHORT_LIST_LENGTH)
          : items
        ).map((item, index) => (
          <ItemElement key={index} item={item} />
        ))}
      </ul>
      {listState === "defaultSmall" && (
        <button onClick={handleButtonClick} className="item-list__btn">
          View all availability
        </button>
      )}
    </div>
  );
};
