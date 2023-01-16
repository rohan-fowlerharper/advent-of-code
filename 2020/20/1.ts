import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const rawTiles = input.trimEnd().split('\n\n')

type Tile = {
  original: string
  vertices: string[]
}
const tiles = new Map<number, Tile>()

rawTiles.map((rawTile) => {
  const [rawId, ...rawTileLines] = rawTile.split('\n')
  const tile = rawTileLines.map((line) => line.split(''))
  const id = Number(rawId.slice(5, -1))
  const vertices = [
    tile[0].join(''),
    tile.map((line) => line[line.length - 1]).join(''),
    tile[tile.length - 1].join(''),
    tile.map((line) => line[0]).join(''),
  ]
  tiles.set(id, {
    original: tile.join(''),
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

const isCorner = (tileId: number) => {
  const tile = tiles.get(tileId)!
  // tile is a corner if it has exactly 2 edges that are shared with another tile
  const count = tile.vertices.filter((vertex) => {
    return tileEdges.get(vertex)!.length === 2
  }).length

  return count === 2
}

const cornerIds = [...tiles.keys()].filter(isCorner)

console.log(cornerIds.reduce((a, b) => a * b))
