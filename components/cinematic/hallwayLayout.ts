// Single source of truth for the hallway's scroll distance <-> camera travel
// relationship. HallwayScene's scroll-track height and Hallway3D's camera
// travel distance must both derive from these so they can never drift apart
// (previously: 420vh was hardcoded independently of services.length * spacing).

export const HALLWAY_DOOR_SPACING = 4.5;

// Calibrated from the original 6-door / 420vh feel — preserves existing scroll
// pacing exactly at 6 services, and keeps it correct if services are added.
export const HALLWAY_VH_PER_TRAVEL_UNIT = 420 / (6 * HALLWAY_DOOR_SPACING);

export function getHallwayTravel(serviceCount: number): number {
  return serviceCount * HALLWAY_DOOR_SPACING;
}

export function getHallwayScrollHeightVh(serviceCount: number): number {
  return getHallwayTravel(serviceCount) * HALLWAY_VH_PER_TRAVEL_UNIT;
}
