import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = (
  await Deno.readTextFile(p.fromFileUrl(import.meta.resolve('./input.txt')))
).trimEnd()

const disk = input
  .split('')
  .map(Number)
  .map((size, i) => ({
    id: i % 2 ? ('.' as const) : i / 2,
    size,
  }))

for (let i = disk.length - 1; i >= 0; i--) {
  if (disk[i].id === '.') continue

  const file = disk[i]

  for (let j = 0; j < i; j++) {
    const free = disk[j]
    if (free.id === '.' && free.size >= file.size) {
      free.size -= file.size
      disk[i] = { id: '.', size: file.size }
      disk.splice(j, 0, file)
      break
    }
  }
}

const checksum = disk
  .flatMap(({ id, size }) => new Array(size).fill(id))
  .reduce((acc, x, i) => (x === '.' ? acc : acc + i * x), 0)

console.log(checksum)
