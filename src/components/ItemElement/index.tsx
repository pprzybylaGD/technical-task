import { Item, AVAILABILITY_OPTIONS } from "@/types";
import { getBadgeColor } from "./utils";
import "./styles.scss";

interface Props {
  item: Item;
}

export const ItemElement = ({ item: { value, amount, text } }: Props) => (
  <li className="item">
    <div className="item__main">
      <span className={`item__badge item__badge--${getBadgeColor(value)}`}>
        {amount}
      </span>
      <span className="item__availability">{AVAILABILITY_OPTIONS[value]}</span>
    </div>
    <p className="item__order">{text}</p>
  </li>
);
