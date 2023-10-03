import {pixelsToCells} from '@app/canvas'
import {getAdjustedSize} from '@app/shared'
import {GridGraph} from '@app/shared/graph'
import {StoreValue, combine, createEvent, createStore, sample} from 'effector'
import {FoodModel} from '../food'
import {SnakeModel} from '../snake'

type UpdatePayload = {
  snakes: StoreValue<typeof SnakeModel.$snakes>
  foods: StoreValue<typeof FoodModel.$food>
}

const adjPageSizes = getAdjustedSize()
const gridSize = pixelsToCells(adjPageSizes.w, adjPageSizes.h)

export const $graph = createStore(new GridGraph(gridSize))
$graph.watch(() => {
  // console.log('[GRAPH STATE UPDATED]: ', g)
  // console.log(
  //   'foods: ',
  //   g.graph.filter((v) => v.value.type === 1)
  // )
  // console.log(
  //   'snakes: ',
  //   g.graph.filter((v) => v.value.type === 2)
  // )
})

export const updateGraph = createEvent<UpdatePayload>()

sample({
  clock: combine({
    foods: FoodModel.$food,
    snakes: SnakeModel.$snakes,
  }),
  target: updateGraph,
})

sample({
  clock: updateGraph,
  source: $graph,
  fn(graph, {foods, snakes}) {
    graph.clear()

    placeObjectsInGraph({graph, snakes, foods})

    return graph.clone()
  },
  target: $graph,
})

function placeObjectsInGraph({
  graph,
  snakes,
  foods,
}: {graph: GridGraph} & UpdatePayload) {
  for (const [coords, id] of foods) {
    const index = graph.coordsToIndex(coords)
    graph.setValueByIndex(index, {type: graph.CELL_TYPE.food, id})
  }

  for (const snake of snakes) {
    for (const segment of snake.body) {
      const index = graph.coordsToIndex(segment)
      graph.setValueByIndex(index, {type: graph.CELL_TYPE.snake, id: snake.id})
    }
  }
}
