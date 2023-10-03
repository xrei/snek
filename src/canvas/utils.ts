import {CELL_SIZE, getAdjustedSize} from '@app/shared'

export function pixelsToCells(w: number, h: number): Size {
  return {
    w: Math.floor(w / CELL_SIZE),
    h: Math.floor(h / CELL_SIZE),
  }
}

export function cellsToPixels(w: number, h: number): Size {
  return {
    w: w * CELL_SIZE,
    h: h * CELL_SIZE,
  }
}

export function cellPosToPixelPos([x, y]: Coords): Coords {
  return [x * CELL_SIZE, y * CELL_SIZE]
}

export function pixelPosToCellPos([x, y]: Coords): Coords {
  return [Math.floor(x / CELL_SIZE), Math.floor(y / CELL_SIZE)]
}

export function getRandomPosition(): Coords {
  const {w, h} = getAdjustedSize()
  const gridSize = pixelsToCells(w, h)

  const rndX = Math.floor(Math.random() * gridSize.w)
  const rndY = Math.floor(Math.random() * gridSize.h)

  return [rndX, rndY]
}
