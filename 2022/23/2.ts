import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const grid = input
  .trimEnd()
  .split('\n')
  .map((l) => l.split(''))

type Dir = [number, number]
type Directions = Array<{ dir: Dir; check: Dir[] }>
type Point = {
  x: number
  y: number
}
type Elf = Point & {
  dir: [number, number] | null
}
type Key = `${number},${number}`
const elves = new Map<Key, Elf>()

for (const [y, row] of grid.entries()) {
  for (const [x, pos] of row.entries()) {
    if (pos === '#') {
      elves.set(`${x},${y}`, { x: x, y: y, dir: null })
    }
  }
}

const getBound = (
  fn: Math['min' | 'max'],
  selector: (elves: Elf) => Elf['x'] | Elf['y']
) => {
  return fn(...Array.from(elves.values()).map(selector))
}

const getBounds = () => {
  const maxX = getBound(Math.max, (e) => e.x)
  const maxY = getBound(Math.max, (e) => e.y)
  const minY = getBound(Math.min, (e) => e.y)
  const minX = getBound(Math.min, (e) => e.x)

  return { maxX, maxY, minY, minX }
}

const log = (map: Map<Key, Elf>) => {
  const { maxX, maxY, minY, minX } = getBounds()

  const grid = Array.from({ length: maxY - minY + 4 }, () =>
    Array.from({ length: maxX - minY + 4 }, () => '.')
  )
  for (const elf of map.values()) {
    grid[elf.y - minY + 1][elf.x - minX + 1] = '#'
  }
  console.log(grid.map((l) => l.join('')).join('\n'), '\n\n')
}

const dirs: Directions = [
  {
    dir: [0, -1],
    check: [
      [1, -1],
      [0, -1],
      [-1, -1],
    ],
  },
  {
    dir: [0, 1],
    check: [
      [1, 1],
      [0, 1],
      [-1, 1],
    ],
  },
  {
    dir: [-1, 0],
    check: [
      [-1, -1],
      [-1, 0],
      [-1, 1],
    ],
  },
  {
    dir: [1, 0],
    check: [
      [1, -1],
      [1, 0],
      [1, 1],
    ],
  },
]

let rounds = 0
while (true) {
  const proposed = new Map<Key, Point>()
  const doubled = new Set<Key>()
  const key = (elf: Point): Key => `${elf.x},${elf.y}`

  for (const [name, elf] of elves) {
    const validDirs = dirs.map(({ check }) => {
      const isValid = check.every(([cx, cy]) => {
        const next = {
          x: elf.x + cx,
          y: elf.y + cy,
        }
        return !elves.has(key(next))
      })

      return isValid
    })

    if (validDirs.every((v) => v)) {
      elves.set(name, { ...elf, dir: null })
      continue
    }

    let idx = -1
    for (let d = 0; d < dirs.length; d++) {
      const isValid = validDirs[(d + rounds) % dirs.length]

      if (isValid) {
        idx = (d + rounds) % dirs.length
        break
      }
    }

    if (idx === -1) continue

    elves.set(name, { ...elf, dir: dirs[idx].dir })

    const {
      dir: [dx, dy],
    } = dirs[idx]
    const next = {
      x: elf.x + dx,
      y: elf.y + dy,
    }

    const nextKey = key(next)
    if (proposed.has(nextKey)) {
      doubled.add(nextKey)
    } else {
      proposed.set(nextKey, next)
    }
  }

  let elvesMoved = 0
  for (const [name, elf] of elves) {
    if (!elf.dir) continue
    elvesMoved++

    const [dx, dy] = elf.dir

    const x = elf.x + dx
    const y = elf.y + dy

    const nextKey = key({ x, y })

    if (proposed.has(nextKey) && !doubled.has(nextKey)) {
      elves.delete(name)
      elves.set(nextKey, { x, y, dir: null })
    }
  }
  rounds++
  if (elvesMoved === 0) break
}

console.log(rounds)
