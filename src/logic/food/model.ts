import {getRandomPosition} from '@app/canvas'
import {genId} from '@app/shared'
import {GridGraph, getRandomEmptyCell} from '@app/shared/graph'
import {createEvent, createStore, sample} from 'effector'

export function createFood(graph?: GridGraph): Food | null {
  if (!graph) return [getRandomPosition(), 'f-' + genId()]

  const coords = getRandomEmptyCell(graph)

  if (!coords) return null

  const idx = graph.coordsToIndex(coords)
  graph.setValueByIndex(idx, {type: graph.CELL_TYPE.food})
  return [coords, 'f-' + genId()]
}

function createNumFoods(n = 10) {
  const xs: Food[] = []

  for (let i = 0; i < n; i++) {
    const food = createFood()
    if (!food) continue
    xs[i] = food
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

export function createFoodIfExist(foods: Food[], graph: GridGraph) {
  const food = createFood(graph)
  if (!food) return foods

  return [...foods, food]
}
