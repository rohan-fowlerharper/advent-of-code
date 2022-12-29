import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = (
  await Deno.readTextFile(p.fromFileUrl(import.meta.resolve('./input.txt')))
).trimEnd()

performance.mark('start')

const lines = input.split('\n').map(Number)

performance.mark('parsed')

const PREAMBLE_SIZE = 25 // 25 for real input

const range = new Set(lines.slice(0, PREAMBLE_SIZE))

for (let i = PREAMBLE_SIZE; i < lines.length; i++) {
  const n = lines[i]
  let valid = false
  for (const p of range) {
    if (range.has(n - p)) {
      valid = true
      break
    }
  }

  if (!valid) {
    console.log(n)
    performance.mark('end')
    break
  }
  range.delete(lines[i - PREAMBLE_SIZE])
  range.add(n)
}

console.log(
  `To parse: ${performance
    .measure('09.1', 'start', 'parsed')
    .duration.toFixed(3)}ms`
)

console.log(
  `To solve: ${performance
    .measure('09.1', 'parsed', 'end')
    .duration.toFixed(3)}ms`
)
