import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input
  .trimEnd()
  .split('\n')
  .map((n, i) => ({ n: Number(n) * 811589153, id: i }))

const result = [...lines.map((l) => ({ ...l }))]
const maxIdx = result.length - 1

for (let n = 0; n < 10; n++) {
  for (let i = 0; i < lines.length; i++) {
    const id = lines[i].id

    const curIdx = result.findIndex((r) => r.id === id)
    const cur = result[curIdx]

    if (cur.n === 0) continue

    let nextIdx = curIdx + cur.n

    if (nextIdx >= maxIdx) {
      nextIdx = nextIdx % maxIdx
    }
    if (nextIdx <= 0) {
      nextIdx = (nextIdx % maxIdx) + maxIdx
    }

    result.splice(curIdx, 1)
    result.splice(nextIdx, 0, cur)
  }
}

const idxZero = result.findIndex((r) => r.n === 0)

console.log(
  result[(idxZero + 1000) % result.length].n +
    result[(idxZero + 2000) % result.length].n +
    result[(idxZero + 3000) % result.length].n
)
