export function manhattanDistance(p1: Coords, p2: Coords): number {
  return Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1])
}
