import {descend, prop, sort} from 'ramda'
import {DIRECTIONS} from './config'
import {GridGraph} from './graph'

export function genId() {
  const a = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString()
  const b = Date.now().toString()
  return a + b
}

export function getNextCoordsByDirection(
  [x, y]: Coords,
  direction: DIRECTIONS
): Coords {
  switch (direction) {
    case DIRECTIONS.LEFT:
      return [x - 1, y]
    case DIRECTIONS.RIGHT:
      return [x + 1, y]
    case DIRECTIONS.UP:
      return [x, y - 1]
    case DIRECTIONS.DOWN:
      return [x, y + 1]
    default:
      return [x, y]
  }
}

export function warpCoords(position: Coords, graph: GridGraph): Coords {
  let [x, y] = position

  // Check and warp X coordinate
  if (x < 0) {
    x = graph.w - 1 // move to rightmost column
  } else if (x >= graph.w) {
    x = 0 // move to leftmost column
  }

  // Check and warp Y coordinate
  if (y < 0) {
    y = graph.h - 1 // move to bottommost row
  } else if (y >= graph.h) {
    y = 0 // move to topmost row
  }

  return [x, y]
}

// eslint-disable-next-line
export function sortDescBy<T extends Record<string, any>>(
  key: string,
  xs: T[]
): T[] {
  // @ts-expect-error unreal
  const comp = descend(prop(key))

  return sort(comp, xs)
}
