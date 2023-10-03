import {getSize} from './config'

export function resizeCanvas(canvas: HTMLCanvasElement) {
  const {w, h} = getSize()
  const dpr = window.devicePixelRatio || 1
  canvas.style.width = w + 'px'
  canvas.style.height = h + 'px'
  canvas.width = w * dpr
  canvas.height = h * dpr
  canvas.getContext('2d')!.scale(dpr, dpr)
}

export function clearCanvas(ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}
