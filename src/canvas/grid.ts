import {pixelsToCells, cellsToPixels} from './utils'
import {getAdjustedSize, CELL_SIZE, EDGE_GAP} from '../shared/config'

export function createGrid(): Path2D {
  const gridPath = new Path2D()
  const {w, h} = getAdjustedSize()

  const gridSize = pixelsToCells(w, h)
  const pxSize = cellsToPixels(gridSize.w, gridSize.h)

  // Draw vertical lines
  for (let i = 0; i <= gridSize.w; i++) {
    const xPos = i * CELL_SIZE + EDGE_GAP + 0.5
    gridPath.moveTo(xPos, EDGE_GAP)
    gridPath.lineTo(xPos, EDGE_GAP + pxSize.h)
  }

  // Draw horizontal lines
  for (let i = 0; i <= gridSize.h; i++) {
    const yPos = i * CELL_SIZE + EDGE_GAP + 0.5
    gridPath.moveTo(EDGE_GAP, yPos)
    gridPath.lineTo(EDGE_GAP + pxSize.w, yPos)
  }

  return gridPath
}

export function drawGrid(ctx: CanvasRenderingContext2D, grid: Path2D) {
  ctx.strokeStyle = '#eee'
  ctx.lineWidth = 1
  ctx.stroke(grid)
}
