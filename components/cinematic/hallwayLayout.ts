// Single source of truth for the hallway's scroll distance <-> camera travel
// relationship. HallwayScene's scroll-track height and Hallway3D's camera
// travel distance must both derive from these so they can never drift apart
// (previously: 420vh was hardcoded independently of services.length * spacing).

export const HALLWAY_DOOR_SPACING = 4.5;
export const HALLWAY_FIRST_DOOR_Z = -3;
export const HALLWAY_CAMERA_START_Z = 4;
// How far past the last door the camera keeps going before scroll hands off
// to the Vault — enough that the last door is fully arrived-at, not just
// glimpsed at the edge of frame.
const ARRIVAL_BUFFER = 2;

// Scroll pacing — how many vh of scrolling per world unit of camera travel.
// Tuned by feel; unrelated to the geometry fix below.
const VH_PER_TRAVEL_UNIT = 15.5;

export function getLastDoorZ(serviceCount: number): number {
  return HALLWAY_FIRST_DOOR_Z - (serviceCount - 1) * HALLWAY_DOOR_SPACING;
}

// Camera travel must reach (a bit past) the last door's actual z position —
// NOT just `serviceCount * spacing`, which undershoots the last door by a
// fixed 2.5 units for any door count (that gap was the real bug behind the
// hallway never fully "arriving" before handing off to the Vault section).
export function getHallwayTravel(serviceCount: number): number {
  const lastDoorZ = getLastDoorZ(serviceCount);
  return HALLWAY_CAMERA_START_Z - lastDoorZ + ARRIVAL_BUFFER;
}

export function getHallwayScrollHeightVh(serviceCount: number): number {
  return getHallwayTravel(serviceCount) * VH_PER_TRAVEL_UNIT;
}
