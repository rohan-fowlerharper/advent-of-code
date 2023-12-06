import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const [times, distances] = input
  .trimEnd()
  .split('\n')
  .map((l) => l.split(/\s+/).slice(1).map(Number))

const scores = times.map((time, i) => {
  const distance = distances[i]

  let timesBeaten = 0
  for (let releaseTime = 1; releaseTime < time; releaseTime++) {
    const distanceReached = (time - releaseTime) * releaseTime

    if (distanceReached > distance) {
      timesBeaten++
    }
  }
  return timesBeaten
})

console.log(scores.reduce((a, b) => a * b))
