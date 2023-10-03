import {DIRECTIONS} from '@app/shared'

const snakeColors = [
  '#FF4081', // Vibrant Pink
  '#40C4FF', // Bright Sky Blue
  '#FFAB40', // Vibrant Orange
  '#7E57C2', // Deep Lavender
  '#69F0AE', // Electric Green
  '#FF5252', // Bright Red
  '#FFD740', // Bright Yellow
  '#00E5FF', // Cyan
  '#536DFE', // Blue
  '#B2FF59', // Lime Green
]

type SnakeConstructor = {
  id: string
  initialPos: Coords
  isAi: boolean
}

export class Snake {
  id: string
  body: Coords[]
  score: number
  direction: DIRECTIONS
  isDead: boolean
  isAi: boolean
  color: {
    head: string
    tail: string
  }

  constructor({id, initialPos, isAi}: SnakeConstructor) {
    this.id = id
    this.body = [initialPos, [initialPos[0] + 1, initialPos[1]]]
    this.isAi = isAi
    this.score = 0
    this.isDead = false
    this.direction = DIRECTIONS.LEFT
    this.color = pickColor()
  }

  get head() {
    return this.body[0]
  }
  get tail() {
    return this.body[this.body.length - 1]
  }

  setDirection(dir: DIRECTIONS) {
    if (Math.abs(dir - this.direction) !== 2) {
      this.direction = dir
    }
  }

  updateScore() {
    this.score = this.score + 1
  }

  setDead(p: boolean) {
    this.isDead = p
  }

  move(newHeadPosition: Coords) {
    this.body = [newHeadPosition, ...this.body.slice(0, -1)]
  }

  grow(newPos: Coords) {
    this.body = [newPos, ...this.body]
    this.updateScore()
  }

  clone(): Snake {
    const cloned = new Snake({
      id: this.id,
      initialPos: this.head,
      isAi: this.isAi,
    })
    cloned.body = [...this.body]
    cloned.score = this.score
    cloned.direction = this.direction
    cloned.isDead = this.isDead
    cloned.color = {...this.color}

    return cloned
  }
}

function pickColor(): {head: string; tail: string} {
  const tail = snakeColors[Math.floor(Math.random() * snakeColors.length)]
  const head = adjustBrightness(tail, 0.9) // Increase brightness by 20% for the head
  return {head, tail}
}

function adjustBrightness(hex: string, factor: number): string {
  let [r, g, b] = [1, 3, 5].map((offset) =>
    parseInt(hex.slice(offset, offset + 2), 16)
  )
  ;[r, g, b] = [r, g, b].map((channel) =>
    Math.min(255, Math.max(0, Math.round(channel * factor)))
  )

  return `#${r.toString(16).padStart(2, '0')}${g
    .toString(16)
    .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}
