import { Availability } from "./types";

export const getBadgeColor = (name: Availability) => {
  const colors: Record<Availability, string> = {
    inStore: "green",
    today: "yellow",
    tomorrow: "blue",
    order: "purple",
    notAvailable: "red",
  };

  return colors[name];
};
