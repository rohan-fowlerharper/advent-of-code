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
  dir: Dir | null
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

const getBounds = () => {
  const getBound = (
    fn: Math['min' | 'max'],
    selector: (elves: Elf) => Elf['x'] | Elf['y']
  ) => {
    return fn(...Array.from(elves.values()).map(selector))
  }

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
    dir: [0, -1], // N
    check: [
      [1, -1], // NE
      [0, -1], // N
      [-1, -1], // NW
    ],
  },
  {
    dir: [0, 1], // S
    check: [
      [1, 1], // SE
      [0, 1], // S
      [-1, 1], // SW
    ],
  },
  {
    dir: [-1, 0], // W
    check: [
      [-1, -1], // NW
      [-1, 0], // W
      [-1, 1], // SW
    ],
  },
  {
    dir: [1, 0], // E
    check: [
      [1, -1], // NE
      [1, 0], // E
      [1, 1], // SE
    ],
  },
]

for (let i = 0; i < 10; i++) {
  const proposed = new Map<Key, Point>()
  const invalid = new Set<Key>()
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
      const isValid = validDirs[(d + i) % dirs.length]

      if (isValid) {
        idx = (d + i) % dirs.length
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
      invalid.add(nextKey)
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

    if (proposed.has(nextKey) && !invalid.has(nextKey)) {
      elves.delete(name)
      elves.set(nextKey, { x, y, dir: null })
    }
  }
  if (elvesMoved === 0) break
}

const { maxX, maxY, minY, minX } = getBounds()

const area = (maxX - minX + 1) * (maxY - minY + 1) - elves.size

console.log(area)
