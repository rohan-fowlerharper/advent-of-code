import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const disk = input
  .trimEnd()
  .split('')
  .map(Number)
  .flatMap<number | '.'>((n, i) =>
    i % 2 ? new Array(n).fill('.') : new Array(n).fill(i / 2)
  )

let firstFreeIndex = disk.indexOf('.')
for (let i = disk.length - 1; i >= 0; i--) {
  if (disk[i] === '.') continue

  const file = disk[i]

  for (let j = disk.indexOf('.', firstFreeIndex); j < i; j++) {
    const free = disk[j]
    if (free === '.') {
      disk[i] = '.'
      disk[j] = file
      firstFreeIndex = j + 1
      break
    }
  }
}

const checksum = disk.reduce<number>(
  (acc, x, i) => (x === '.' ? acc : acc + i * x),
  0
)

console.log(checksum)
