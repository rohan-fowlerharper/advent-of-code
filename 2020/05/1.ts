import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

performance.mark('start')

const lines = input.trimEnd().split('\n')

performance.mark('parsed')

const avg = (a: number, b: number) => Math.floor((a + b) / 2)

const results = lines.map((line) => {
  let high = 127
  let low = 0
  for (let i = 0; i < 7; i++) {
    const letter = line[i]
    const newAvg = avg(high, low)

    if (letter === 'F') high = newAvg
    else low = newAvg
  }
  const row = high
  high = 7
  low = 0
  for (let i = 7; i < line.length; i++) {
    const letter = line[i]
    const newAvg = avg(high, low)

    if (letter === 'L') high = newAvg
    else low = newAvg
  }
  const column = high

  return row * 8 + column
})

const result = Math.max(...results)

performance.mark('end')

console.log(result)

console.log(
  `To parse: ${performance
    .measure('05.1', 'start', 'parsed')
    .duration.toFixed(3)}ms`
)

console.log(
  `To solve: ${performance
    .measure('05.1', 'parsed', 'end')
    .duration.toFixed(3)}ms`
)
