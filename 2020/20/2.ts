import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const rawTiles = input.trimEnd().split('\n\n')

type Tile = {
  id: number
  original: string[]
  vertices: string[]
  neighbours?: number[]
}
const tiles = new Map<number, Tile>()

rawTiles.map((rawTile) => {
  const [rawId, ...rawTileLines] = rawTile.split('\n')
  const tile = rawTileLines.map((line) => line.split(''))
  const id = Number(rawId.slice(5, -1))
  const vertices = [
    tile[0].join(''), // Top
    tile.map((line) => line[line.length - 1]).join(''), // Right
    tile[tile.length - 1].join(''), // Bottom
    tile.map((line) => line[0]).join(''), // Left
  ]
  tiles.set(id, {
    id,
    original: rawTileLines,
    vertices,
  })
})

const tileEdges = new Map<string, number[]>()

for (const [tileId, tile] of tiles) {
  const check = (vertex: string) => {
    if (tileEdges.has(vertex)) {
      tileEdges.get(vertex)!.push(tileId)
    } else {
      tileEdges.set(vertex, [tileId])
    }
  }

  for (const vertex of tile.vertices) {
    check(vertex)
    check(vertex.split('').reverse().join(''))
  }
}

for (const [tileId, tile] of tiles) {
  const neighbours: number[] = []

  for (const vertex of tile.vertices) {
    const ids = tileEdges.get(vertex)!
    for (const id of ids) {
      if (id !== tileId) {
        neighbours.push(id)
      }
    }
  }

  tile.neighbours = neighbours
}

// create a grid of tiles based on their vertices, assign a corner tile randomly to the top left
const grid = new Map<string, { id: number; orientation: 0 | 1 | 2 | 3 }>()
const cornerIds = [...tiles.keys()].filter((tileId) => {
  const tile = tiles.get(tileId)!
  // tile is a corner if it has exactly 2 edges that are shared with another tile
  const count = tile.vertices.filter((vertex) => {
    return tileEdges.get(vertex)!.length === 2
  }).length

  return count === 2
})
const rotateBy = (vertices: string[], orientation: 0 | 1 | 2 | 3) => {
  const rotated = [...vertices]
  for (let i = 0; i < orientation; i++) {
    rotated[0] = rotated[3].split('').reverse().join('')
    rotated[1] = rotated[0]
    rotated[2] = rotated[1].split('').reverse().join('')
    rotated[3] = rotated[2]
  }
  return rotated
}

const cornerId = cornerIds[0]
console.log(cornerId)
console.log(tiles.get(cornerId)!.vertices)
console.log(rotateBy(tiles.get(cornerId)!.vertices, 1))
const firstMatchedEdge = tiles.get(cornerId)!.vertices.findIndex((vertex) => {
  return tileEdges.get(vertex)!.length === 2
})

const cornerOrientation = ((firstMatchedEdge + 1) % 4) as 0 | 1 | 2 | 3

grid.set('0,0', {
  id: cornerId,
  orientation: cornerOrientation,
})

console.log(tiles.get(cornerId))
console.log(
  tiles.get(cornerId)?.neighbours?.map((id) => tiles.get(id)?.vertices)
)
console.log(tiles.get(cornerId)?.neighbours?.map((id) => id))

console.log(grid)
let stackSize = 0
const fillNeighbours = (x: number, y: number) => {
  if (stackSize++ > 10) {
    return
  }

  // console.log(grid)
  const gridTile = grid.get(`${x},${y}`)!
  const tile = tiles.get(gridTile.id)!

  const [top, right, bottom, left] = rotateBy(
    tile.vertices,
    gridTile.orientation
  )

  // console.log([top, right, bottom, left])

  console.log('tile', `${x},${y}`, tile.id)

  console.log('right', right, tileEdges.get(right))
  console.log('bottom', bottom, tileEdges.get(bottom))

  const rightNeighbour = tileEdges.get(right)!.find((id) => id !== tile.id)
  const bottomNeighbour = tileEdges.get(bottom)!.find((id) => id !== tile.id)

  if (rightNeighbour && !grid.has(`${x + 1},${y}`)) {
    const rightNeighbourTile = tiles.get(rightNeighbour)!
    const rightNeighbourOrientation = ((rightNeighbourTile.vertices.findIndex(
      (vertex) =>
        vertex === right || vertex === right.split('').reverse().join('')
    ) +
      0) %
      4) as 0 | 1 | 2 | 3
    grid.set(`${x + 1},${y}`, {
      id: rightNeighbour,
      orientation: rightNeighbourOrientation,
    })
    fillNeighbours(x + 1, y)
  }

  if (bottomNeighbour && !grid.has(`${x},${y + 1}`)) {
    const bottomNeighbourTile = tiles.get(bottomNeighbour)!
    const bottomNeighbourOrientation = ((bottomNeighbourTile.vertices.findIndex(
      (vertex) =>
        vertex === bottom || vertex === bottom.split('').reverse().join('')
    ) +
      0) %
      4) as 0 | 1 | 2 | 3
    grid.set(`${x},${y + 1}`, {
      id: bottomNeighbour,
      orientation: bottomNeighbourOrientation,
    })
    fillNeighbours(x, y + 1)
  }
}

fillNeighbours(0, 0)

console.log(grid)

// TODO: finish attaching the tiles to the grid
