import './shared/css/index.css'
import {mountUi} from './ui'
import {clearCanvas, resizeCanvas} from './shared/canvas'
import {createGrid, drawGrid} from './canvas/grid'
import {Logic, State} from './logic'
import {drawFood, drawSnake} from './canvas'
import {InputManager} from './shared'
import {checkCellAhead} from './shared/graph'
import {snakeController} from '@app/controllers'

const inputManager = new InputManager()

type WithState = {state: State}

const main = () => {
  mountUi()

  const canvas = document.getElementById('appCanvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d')!

  resizeCanvas(canvas, ctx)

  const grid = createGrid()
  drawGrid(ctx, grid)

  const renderFn = ({state}: WithState) => {
    const {foods, snakes, graph, snakesPathData} = state

    clearCanvas(ctx)
    drawSnake({ctx, snakes, graph, snakePaths: snakesPathData})

    drawFood({ctx, food: foods, graph})
    drawGrid(ctx, grid)
  }
  const updateFn = ({state}: WithState) => {
    const {snakes, foods} = state
    const graph = state.graph
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

      const {path, processed, nextCoords, nextDirection} = snakeController({
        graph,
        snake,
        foods: nextState.foods,
        inputManager,
      })

      if (!nextCoords) {
        snake.setDead()
        // Logic.GameModel.pause()
        continue
      }

      const nextCell = checkCellAhead(nextCoords, graph)!
      const nextCellType = nextCell && nextCell.value.type

      switch (nextCellType) {
        case graph.CELL_TYPE.food:
          nextState.foods = Logic.FoodModel.clearAndCreateFood(
            nextState.foods,
            nextCell.value.id!,
            graph
          )

          snake.grow(nextCoords)
          break
        case graph.CELL_TYPE.snake:
          snake.setDead()
          break
        case graph.CELL_TYPE.empty:
        default:
          snake.setDirection(nextDirection!)
          snake.move(nextCoords)
          break
      }

      Logic.GraphModel.updateSnakeInGraph({graph, nextSnake: snake, oldSnake})
      Logic.SnakeModel.addSnakeNavDetails({
        snakeId: snake.id,
        path,
        processed,
      })
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
