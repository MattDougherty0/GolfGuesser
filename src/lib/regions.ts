/**
 * Canonical state-to-region mapping (6 regions).
 * Based on United States Region Maps.
 */
export const REGIONS = [
  "West",
  "Southwest",
  "Midwest",
  "South",
  "Mid Atlantic",
  "New England",
] as const;

export type Region = (typeof REGIONS)[number];

export const STATE_TO_REGION: Record<string, string> = {
  // West
  Alaska: "West",
  California: "West",
  Colorado: "West",
  Idaho: "West",
  Montana: "West",
  Nevada: "West",
  Oregon: "West",
  Washington: "West",
  Wyoming: "West",
  // Southwest
  Arizona: "Southwest",
  Hawaii: "Southwest",
  "New Mexico": "Southwest",
  Oklahoma: "Southwest",
  Texas: "Southwest",
  // Midwest
  Illinois: "Midwest",
  Indiana: "Midwest",
  Iowa: "Midwest",
  Kansas: "Midwest",
  Michigan: "Midwest",
  Minnesota: "Midwest",
  Missouri: "Midwest",
  Nebraska: "Midwest",
  "North Dakota": "Midwest",
  Ohio: "Midwest",
  "South Dakota": "Midwest",
  Wisconsin: "Midwest",
  // South
  Alabama: "South",
  Arkansas: "South",
  Florida: "South",
  Georgia: "South",
  Kentucky: "South",
  Louisiana: "South",
  Mississippi: "South",
  "North Carolina": "South",
  "South Carolina": "South",
  Tennessee: "South",
  "West Virginia": "South",
  // Mid Atlantic
  Delaware: "Mid Atlantic",
  "District of Columbia": "Mid Atlantic",
  Maryland: "Mid Atlantic",
  "New Jersey": "Mid Atlantic",
  "New York": "Mid Atlantic",
  Pennsylvania: "Mid Atlantic",
  Virginia: "Mid Atlantic",
  // New England
  Connecticut: "New England",
  Maine: "New England",
  Massachusetts: "New England",
  "New Hampshire": "New England",
  "Rhode Island": "New England",
  Vermont: "New England",
};

export function getRegionForState(state: string): string {
  return STATE_TO_REGION[state] ?? "Unknown";
}
