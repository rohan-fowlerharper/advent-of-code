import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.trimEnd().split('\n')

const avg = (a: number, b: number) => Math.floor((a + b) / 2)

const seatIds = lines.map((line) => {
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

seatIds.sort((a, b) => a - b)

for (const [i, seatId] of seatIds.entries()) {
  if (seatId + 1 !== seatIds[i + 1]) {
    console.log(seatId + 1)
    break
  }
}
