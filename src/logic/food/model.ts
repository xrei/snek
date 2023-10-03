import {getRandomPosition} from '@app/canvas'
import {genId} from '@app/shared'
import {createEvent, createStore, sample} from 'effector'

export function createFood(): Food {
  return [getRandomPosition(), 'f-' + genId()]
}

function createNumFoods(n = 10) {
  const xs: Food[] = []

  for (let i = 0; i < n; i++) {
    xs[i] = createFood()
  }
  return xs
}

export const $food = createStore<Food[]>(createNumFoods())

export const updateFoods = createEvent<Food[]>()
export const reset = createEvent()

sample({
  source: $food,
  clock: updateFoods,
  fn: (_, updated) => updated,
  target: $food,
})

sample({
  clock: reset,
  fn: () => createNumFoods(),
  target: $food,
})

export function clearFoodById(foods: Food[], id?: string) {
  return foods.filter((x) => x[1] !== id)
}
