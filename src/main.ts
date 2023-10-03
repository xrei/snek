import './shared/css/index.css'
import {mountUi} from './ui'
import {clearCanvas, resizeCanvas} from './shared/canvas'
import {createGrid, drawGrid} from './canvas/grid'
import {Logic, State} from './logic'
import {drawFood, drawSnake} from './canvas'
import {InputManager, getNextPositionByDirection, warpPosition} from './shared'
import {checkCellAhead} from './shared/graph'

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
    console.log('[RENDER end]')
  }
  const updateFn = ({state}: WithState) => {
    const {snakes, foods} = state
    const graph = state.graph.clone()
    const inputDirection = inputManager.getDirection()
    const updatedSnakes = []
    let updatedFoods = [...foods]

    for (const snake of snakes) {
      if (snake.isDead) {
        updatedSnakes.push(snake)
        continue
      }
      const updatedSnake = snake.clone()

      if (Number.isInteger(inputDirection)) {
        updatedSnake.setDirection(inputDirection)
      }

      const nextPosition = warpPosition(
        getNextPositionByDirection(updatedSnake.head, updatedSnake.direction),
        graph
      )

      const nextCell = checkCellAhead(nextPosition, graph)
      const nextCellType = nextCell && nextCell.value.type

      switch (nextCellType) {
        case graph.CELL_TYPE.food:
          updatedSnake.grow(nextPosition)
          if (nextCell) {
            updatedFoods = [
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

      updatedSnakes.push(updatedSnake)
    }

    Logic.updateState({snakes: updatedSnakes, foods: updatedFoods})
    console.log('[UPDATE end]')
  }

  Logic.createLoopFactory({
    $state: Logic.$state,
    GameModel: Logic.GameModel,
    renderFn,
    updateFn,
  }).start()
}

main()
