import {getRandomPosition} from '@app/canvas'
import {genId} from '@app/shared'
import {GridGraph, getRandomEmptyCell} from '@app/shared/graph'
import {createEvent, createStore, sample} from 'effector'

export const $food = createStore<Food[]>(createManyFoods())

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
  fn: () => createManyFoods(),
  target: $food,
})

function createManyFoods(n = 10) {
  const xs: Food[] = []

  for (let i = 0; i < n; i++) {
    const food = createFood()
    if (!food) continue
    xs[i] = food
  }
  return xs
}

export function createFood(graph?: GridGraph): Food | null {
  if (!graph) return [getRandomPosition(), 'f-' + genId()]

  const coords = getRandomEmptyCell(graph)

  if (!coords) return null

  const idx = graph.coordsToIndex(coords)
  const foodId = 'food-' + genId()
  graph.setValueByIndex(idx, {type: graph.CELL_TYPE.food, id: foodId})

  return [coords, foodId]
}

export function clearFoodById(foods: Food[], id: string) {
  return foods.filter((x) => x[1] !== id)
}

export function createFoodIfExist(foods: Food[], graph: GridGraph) {
  const food = createFood(graph)
  if (!food) return foods

  return [food, ...foods]
}

export function clearAndCreateFood(
  foods: Food[],
  id: string,
  graph: GridGraph
) {
  return createFoodIfExist(clearFoodById(foods, id), graph)
}
