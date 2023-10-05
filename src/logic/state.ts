import {GraphModel} from './graph'
import {FoodModel} from './food'
import {SnakeModel} from './snake'
import {StoreValue, combine, createEvent, sample} from 'effector'
import {GameModel} from './game'

export const $state = combine({
  foods: FoodModel.$food,
  graph: GraphModel.$graph,
  snakes: SnakeModel.$snakes,
  snakesPathData: SnakeModel.$snakesPathData,
})

export type State = StoreValue<typeof $state>

export const updateState = createEvent<{
  snakes: StoreValue<typeof SnakeModel.$snakes>
  foods: StoreValue<typeof FoodModel.$food>
}>()

sample({
  clock: updateState,
  fn: ({foods}) => foods,
  target: FoodModel.updateFoods,
})

sample({
  clock: updateState,
  fn: ({snakes}) => snakes,
  target: SnakeModel.updateSnakes,
})

sample({
  clock: GameModel.restart,
  target: [SnakeModel.reset, FoodModel.reset],
})
