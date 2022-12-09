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

const h: Point = { x: 0, y: 0 }
const rope: Point[] = Array.from({ length: 9 }, () => ({ x: 0, y: 0 }))

const visited = new Set<string>()

for (const line of lines) {
  const [dir, num] = line.split(' ') as [Direction, string]
  const n = Number(num)
  const [x, y] = dirs[dir] as [number, number]

  for (let i = 0; i < n; i++) {
    h.x += x
    h.y += y

    for (let j = 0; j < rope.length; j++) {
      const t = rope[j]
      const prev = rope[j - 1] || h

      const dx = Math.abs(prev.x - t.x)
      const dy = Math.abs(prev.y - t.y)

      // if overlapping or adjacent, skip
      if ((dx === 0 && dy === 0) || dx + dy === 1 || (dx === 1 && dy === 1)) {
        continue
      }

      /*
        T.H.. -> .TH..
      */
      if (dx === 0) {
        t.y = (prev.y + t.y) / 2
        continue
      }
      /*
        ..H..    ..H..
        ..... -> ..T..
        ..T..    .....
      */
      if (dy === 0) {
        t.x = (prev.x + t.x) / 2
        continue
      }
      /*
        ..H..    ..H..
        ..... -> .T...
        T....    .....
      */
      if (dx > 1 && dy > 1) {
        t.x = (prev.x + t.x) / 2
        t.y = (prev.y + t.y) / 2
        continue
      }
      /*
        ..H..    .TH..
        T.... -> .....
        .....    .....
      */
      if (dx > dy) {
        t.x = (prev.x + t.x) / 2
        t.y = prev.y
        continue
      }
      /*
        ..H..    ..H..
        ..... -> ..T..
        .T...    .....
      */
      if (dy > dx) {
        t.x = prev.x
        t.y = (prev.y + t.y) / 2
        continue
      }
    }

    const tail = rope.at(-1)!
    visited.add(`${tail.x},${tail.y}`)
  }
}

console.log(visited.size)
