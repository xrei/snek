import './shared/css/index.css'
import {mountUi} from './ui'
import {clearCanvas, resizeCanvas} from './shared/canvas'
import {createGrid, drawGrid} from './canvas/grid'
import {Logic, State} from './logic'
import {drawFood, drawSnake} from './canvas'
import {InputManager} from './shared'
import {checkCellAhead} from './shared/graph'
import {snakeController} from './snakeController'

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
    const {foods, snakes, graph, snakesPathData} = state

    console.log('state at render: ', state)
    clearCanvas(ctx)

    for (const snake of snakes) {
      const snakePath = snakesPathData[snake.id]?.path ?? []

      drawSnake({ctx, snake, graph, snakePath})
    }

    drawFood({ctx, food: foods, graph})
    drawGrid(ctx, grid)
    // console.log('[RENDER end]')
  }
  const updateFn = ({state}: WithState) => {
    const {snakes, foods} = state
    const graph = state.graph.clone()
    const nextState: {snakes: typeof state.snakes; foods: typeof state.foods} =
      {
        snakes: snakes.map((snake) => snake.clone()),
        foods: [...foods],
      }

    for (const snake of nextState.snakes) {
      if (snake.isDead) {
        continue
      }
      const oldSnake = snake

      const {path, processed, nextCoords} = snakeController({
        graph,
        snake,
        foods: nextState.foods,
        inputManager,
      })

      if (!nextCoords) {
        snake.setDead(true)
        Logic.GameModel.pause()
        continue
      }

      Logic.SnakeModel.addSnakeNavDetails({
        snakeId: snake.id,
        path,
        processed,
      })

      const nextCell = checkCellAhead(nextCoords, graph)!
      const nextCellType = nextCell && nextCell.value.type

      switch (nextCellType) {
        case graph.CELL_TYPE.food:
          snake.grow(nextCoords)
          nextState.foods = Logic.FoodModel.createFoodIfExist(
            Logic.FoodModel.clearFoodById(foods, nextCell.value.id),
            graph
          )
          break

        case graph.CELL_TYPE.snake:
          snake.setDead(true)
          Logic.GameModel.pause()
          break

        case graph.CELL_TYPE.empty:
        default:
          snake.move(nextCoords)
          break
      }

      Logic.GraphModel.updateSnakeInGraph({graph, nextSnake: snake, oldSnake})
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
