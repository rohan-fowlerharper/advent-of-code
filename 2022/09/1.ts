import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.split('\n')

const dirs = {
  U: [0, 1],
  D: [0, -1],
  L: [-1, 0],
  R: [1, 0],
}

type Direction = keyof typeof dirs
type Point = { x: number; y: number }

const h = { x: 0, y: 0 } as { x: number; y: number }
const t = { x: 0, y: 0 } as { x: number; y: number }

const visited = new Set<string>()

for (const line of lines) {
  const [dir, num] = line.split(' ') as ['U' | 'D' | 'L' | 'R', string]
  const n = Number(num)
  const [x, y] = dirs[dir] as [number, number]

  visited.add('0,0')

  for (let i = 0; i < n; i++) {
    h.x += x
    h.y += y
    const dx = Math.abs(h.x - t.x)
    const dy = Math.abs(h.y - t.y)

    if ((dx === 0 && dy === 0) || dx + dy === 1 || (dx === 1 && dy === 1)) {
      continue
    }

    /*
      T.H.. -> .TH..
    */
    if (h.x === t.x) {
      t.x = (h.x + t.x) / 2
    }
    /*
      ..H..    ..H..
      ..... -> ..T..
      ..T..    .....
    */
    if (h.y === t.y) {
      t.y = (h.y + t.y) / 2
    }
    /*
      ..H..    .TH..
      T.... -> .....
      .....    .....
    */
    if (dx > dy) {
      t.x = (h.x + t.x) / 2
      t.y = h.y
    }
    /*
      ..H..    ..H..
      ..... -> ..T..
      .T...    .....
    */
    if (dy > dx) {
      t.x = h.x
      t.y = (h.y + t.y) / 2
    }
    visited.add(`${t.x},${t.y}`)
  }
}

console.log(visited.size)
