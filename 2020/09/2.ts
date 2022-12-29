import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

performance.mark('start')

const lines = input.trimEnd().split('\n').map(Number)

performance.mark('parsed')

const PREAMBLE_SIZE = 25 // 25 for real input

let index = -1
let target = -1

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
    index = i
    target = n
    break
  }

  range.delete(lines[i - PREAMBLE_SIZE])
  range.add(n)
}

if (index === -1) throw new Error('No invalid number found')

const window = []
let sum = 0

for (let i = index - 1; i >= 0; i--) {
  const n = lines[i]

  window.push(n)
  sum += n

  if (sum > target) {
    sum -= window.shift()!
    continue
  }
  if (sum === target) {
    console.log(Math.min(...window) + Math.max(...window))
    performance.mark('end')
    break
  }
}

console.log(
  `To parse: ${performance
    .measure('09.2', 'start', 'parsed')
    .duration.toFixed(3)}ms`
)

console.log(
  `To solve: ${performance
    .measure('09.2', 'parsed', 'end')
    .duration.toFixed(3)}ms`
)
