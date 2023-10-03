import './shared/css/index.css'
import {mountUi} from './ui'
import {clearCanvas, resizeCanvas} from './shared/canvas'
import {createGrid, drawGrid} from './canvas/grid'
import {Logic, State} from './logic'
import {drawFood, drawSnake} from './canvas'
import {InputManager, getNextPositionByDirection, warpPosition} from './shared'
import {checkCellAhead} from './shared/graph'
import {createPathfinder, findClosesObject} from './pathfinding'

const inputManager = new InputManager()

type WithState = {state: State}

const main = () => {
  mountUi()

  const canvas = document.getElementById('appCanvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d')!

  resizeCanvas(canvas)

  const grid = createGrid()
  drawGrid(ctx, grid)

  const renderFn = ({state}: WithState) => {
    const {foods, snakes, graph} = state
    clearCanvas(ctx)

    drawFood({ctx, food: foods})

    for (const snake of snakes) {
      drawSnake({ctx, snake, graph})
    }
    drawGrid(ctx, grid)
    // console.log('[RENDER end]')
  }
  const updateFn = ({state}: WithState) => {
    const {snakes, foods} = state
    const graph = state.graph.clone()
    const inputDirection = inputManager.getDirection()
    const nextState: {snakes: typeof state.snakes; foods: typeof state.foods} =
      {
        snakes: [],
        foods: [...foods],
      }

    for (const snake of snakes) {
      if (snake.isDead) {
        nextState.snakes.push(snake)
        continue
      }
      const updatedSnake = snake.clone()

      let nextPosition: Coords | undefined

      if (updatedSnake.isAi && updatedSnake.aiStrategy) {
        const pathfinder = createPathfinder(updatedSnake.aiStrategy)
        const res = pathfinder({
          goal:
            graph.coordsToVertex(
              findClosesObject(
                updatedSnake.head,
                nextState.foods.map((v) => v[0])
              )
            ) ?? null,
          graph,
          start: updatedSnake.head,
        })

        nextPosition = res ? res.nextMove : undefined
      } else {
        if (Number.isInteger(inputDirection)) {
          updatedSnake.setDirection(inputDirection)
        }
        nextPosition = warpPosition(
          getNextPositionByDirection(updatedSnake.head, updatedSnake.direction),
          graph
        )
      }

      if (!nextPosition) {
        updatedSnake.setDead(true)
        nextState.snakes.push(updatedSnake)
        continue
      }

      const nextCell = checkCellAhead(nextPosition, graph)
      const nextCellType = nextCell && nextCell.value.type

      switch (nextCellType) {
        case graph.CELL_TYPE.food:
          updatedSnake.grow(nextPosition)
          if (nextCell) {
            nextState.foods = [
              ...Logic.FoodModel.clearFoodById(foods, nextCell.value.id),
              Logic.FoodModel.createFood(),
            ]
          }
          break

        case graph.CELL_TYPE.snake:
          updatedSnake.setDead(true)
          Logic.GameModel.pause()
          break

        case graph.CELL_TYPE.empty:
          updatedSnake.move(nextPosition)
          break

        default:
          updatedSnake.move(nextPosition)
          break
      }

      nextState.snakes.push(updatedSnake)
    }

    Logic.updateState(nextState)
    // console.log('[UPDATE end]')
  }

  Logic.createLoopFactory({
    $state: Logic.$state,
    GameModel: Logic.GameModel,
    renderFn,
    updateFn,
  }).start()
}

main()
