import {CELL_SIZE, EDGE_GAP, getDigitsFromId} from '@app/shared'
import {cellPosToPixelPos} from './utils'
import {Snake, SnakeNavDetsMap} from '@app/logic/snake'
import {GridGraph} from '@app/shared/graph'
import {GameModel} from '@app/logic/game'

type GenericDrawParams = {
  ctx: CanvasRenderingContext2D
  pos: Coords
  color?: string
  graph?: GridGraph
}

type DrawFoodParams = Omit<GenericDrawParams, 'pos'> & {
  food: Food[]
}

type DrawSnakeParams = Omit<GenericDrawParams, 'pos'> & {
  snakes: Snake[]
  snakePaths: SnakeNavDetsMap
  graph: GridGraph
}

type DrawPathParams = {
  ctx: CanvasRenderingContext2D
  path: number[]
  graph: GridGraph
  color: string
  offsetIdx: number
  offsetLen: number
}

type DrawTextParams = GenericDrawParams & {
  text: string
  fontSize?: number
}

export function drawSquare({ctx, pos, color = 'green'}: GenericDrawParams) {
  const [x, y] = cellPosToPixelPos(pos)
  const size = CELL_SIZE

  ctx.fillStyle = color
  ctx.fillRect(x + EDGE_GAP, y + EDGE_GAP, size, size)
}

export function drawText({
  ctx,
  pos,
  color = 'black',
  fontSize,
  text,
}: DrawTextParams) {
  const [x, y] = cellPosToPixelPos(pos)

  const fSize = fontSize || Math.floor(CELL_SIZE * 0.45)
  ctx.font = `${fSize}px Arial`
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.fillText(
    text,
    2 + EDGE_GAP + x + CELL_SIZE / 2,
    2 + EDGE_GAP + y + CELL_SIZE / 2
  )
}

function drawIndexText({graph, pos, ...rest}: GenericDrawParams) {
  const idx = graph?.coordsToIndex(pos).toString() ?? ''

  drawText({text: idx, pos, ...rest})
}

export function drawFood({ctx, food, graph}: DrawFoodParams) {
  const isDebug = GameModel.$isDebug.getState()

  for (const val of food) {
    // drawSquare({ctx, pos: val[0]})
    drawText({ctx, pos: val[0], text: '🍕', fontSize: 16})

    if (isDebug) {
      drawIndexText({ctx, pos: val[0], graph})
    }
  }
}

export function drawSnake({ctx, snakes, snakePaths, graph}: DrawSnakeParams) {
  const isDebug = GameModel.$isDebug.getState()

  for (const snake of snakes) {
    const snakeNavDets = snakePaths.get(snake.id)
    const snakePath = snakeNavDets?.path ?? []
    const snakeProcessedCells = snakeNavDets?.processed ?? []

    if (
      isDebug &&
      snake.isAi &&
      snakePath.length &&
      snakeProcessedCells.length
    ) {
      for (const cell of snakeProcessedCells) {
        drawSquare({
          ctx,
          pos: graph.indexToCoords(cell),
          color: snake.color.processedColor,
        })
      }
      drawPath({
        ctx,
        color: snake.isDead ? ctx.canvas.style.background : snake.color.head,
        graph,
        path: snakePath,
        offsetIdx: getDigitsFromId(snake.id),
        offsetLen: snakes.length,
      })
    }

    for (const segment of snake.body) {
      const isDead = snake.isDead
      const isHead = snake.head === segment
      const color = isHead ? snake.color.head : snake.color.tail
      const deadColor = isHead ? '#212' : 'rgba(66, 66, 66, 40)'

      drawSquare({
        ctx,
        pos: segment,
        color: isDead ? deadColor : color,
      })

      if (isDebug) {
        drawIndexText({ctx, pos: segment, graph})
      }
    }
  }
}

export function drawPath({
  ctx,
  path,
  graph,
  color,
  offsetIdx,
  offsetLen,
}: DrawPathParams) {
  if (!path.length) return

  const offsetAmount = 3
  const offsetMinLen = offsetLen < 4 ? 4 : offsetLen
  const centered = (n: number) => n + EDGE_GAP + CELL_SIZE / 2
  const calcOffset = (n: number) =>
    n + offsetAmount * Math.sin((offsetIdx * 2 * Math.PI) / offsetMinLen)

  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.lineWidth = 2

  const startCoords = graph.indexToCoords(path[0])
  const startPxCoords = cellPosToPixelPos(startCoords)

  const adjCoords: Coords = [
    calcOffset(centered(startPxCoords[0])),
    calcOffset(centered(startPxCoords[1])),
  ]

  ctx.moveTo(...adjCoords)

  for (let i = 1; i < path.length; i++) {
    const coords = graph.indexToCoords(path[i])
    const pxCoords = cellPosToPixelPos(coords)

    ctx.lineTo(
      calcOffset(centered(pxCoords[0])),
      calcOffset(centered(pxCoords[1]))
    )
  }
  ctx.stroke()
}
