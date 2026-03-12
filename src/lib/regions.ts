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

/** Region to states mapping (inverse of STATE_TO_REGION). */
export const REGION_TO_STATES: Record<string, string[]> = Object.entries(
  STATE_TO_REGION
).reduce<Record<string, string[]>>((acc, [state, region]) => {
  if (!acc[region]) acc[region] = [];
  acc[region].push(state);
  return acc;
}, {});

export function getStatesForRegion(region: string): string[] {
  return REGION_TO_STATES[region] ?? [];
}

/** State name to 2-letter abbreviation. */
export const STATE_ABBREV: Record<string, string> = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA",
  Colorado: "CO", Connecticut: "CT", Delaware: "DE", "District of Columbia": "DC",
  Florida: "FL", Georgia: "GA", Hawaii: "HI", Idaho: "ID", Illinois: "IL",
  Indiana: "IN", Iowa: "IA", Kansas: "KS", Kentucky: "KY", Louisiana: "LA",
  Maine: "ME", Maryland: "MD", Massachusetts: "MA", Michigan: "MI", Minnesota: "MN",
  Mississippi: "MS", Missouri: "MO", Montana: "MT", Nebraska: "NE", Nevada: "NV",
  "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
  "North Carolina": "NC", "North Dakota": "ND", Ohio: "OH", Oklahoma: "OK",
  Oregon: "OR", Pennsylvania: "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", Tennessee: "TN", Texas: "TX", Utah: "UT", Vermont: "VT",
  Virginia: "VA", Washington: "WA", "West Virginia": "WV", Wisconsin: "WI", Wyoming: "WY",
};

export function getStatesAbbrevForRegion(region: string): string {
  const states = getStatesForRegion(region);
  return states.map((s) => STATE_ABBREV[s] ?? s).join(", ");
}
