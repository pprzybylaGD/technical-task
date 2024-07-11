export const AVAILABILITY_OPTIONS = {
  inStore: "In Store",
  today: "Today",
  tomorrow: "Tomorrow",
  order: "Order",
  notAvailable: "Not Available",
} as const;

export type Availability = keyof typeof AVAILABILITY_OPTIONS;
export type AvailabilityLabel = (typeof AVAILABILITY_OPTIONS)[Availability];

export interface Item {
  value: Availability;
  amount: number;
  text: string;
}
