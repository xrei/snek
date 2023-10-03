import {getSize} from './config'

export function resizeCanvas(canvas: HTMLCanvasElement) {
  const {w, h} = getSize()
  canvas.width = w
  canvas.height = h
}

export function clearCanvas(ctx: CanvasRenderingContext2D) {
  const {w, h} = getSize()
  ctx.clearRect(0, 0, w, h)
}
