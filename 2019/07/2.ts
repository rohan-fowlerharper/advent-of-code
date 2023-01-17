import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'
import run from './computer.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const numbers = input.trimEnd().replaceAll('\n', '').split(',').map(Number)

const uniqueCombinations = (min: number, max: number) => {
  const combinations: number[][] = []

  for (let a = min; a <= max; a++) {
    for (let b = min; b <= max; b++) {
      if (b === a) continue

      for (let c = min; c <= max; c++) {
        if (c === a || c === b) continue

        for (let d = min; d <= max; d++) {
          if (d === a || d === b || d === c) continue

          for (let e = min; e <= max; e++) {
            if (e === a || e === b || e === c || e === d) continue

            combinations.push([a, b, c, d, e])
          }
        }
      }
    }
  }

  return combinations
}

const combinations = uniqueCombinations(5, 9)

const outputs = combinations.map((combination) => {
  let signal = 0
  const ns = [...numbers]

  const machines = combination.map((phase) => {
    return run(phase, ns)
  })

  let i = 0
  while (true) {
    const [output, hasHalted] = machines[i % 5](signal)
    if (hasHalted) break

    signal = output

    i++
  }

  return signal
})

console.log(Math.max(...outputs))
