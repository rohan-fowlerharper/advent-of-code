import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'
import createAmp from './computer.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const numbers = input.trimEnd().replaceAll('\n', '').split(',').map(Number)

const uniqueCombinations = (length: number) => {
  const combinations: number[][] = []

  for (let a = 0; a < length; a++) {
    for (let b = 0; b < length; b++) {
      if (b === a) continue

      for (let c = 0; c < length; c++) {
        if (c === a || c === b) continue

        for (let d = 0; d < length; d++) {
          if (d === a || d === b || d === c) continue

          for (let e = 0; e < length; e++) {
            if (e === a || e === b || e === c || e === d) continue

            combinations.push([a, b, c, d, e])
          }
        }
      }
    }
  }

  return combinations
}

const combinations = uniqueCombinations(5)

const outputs = combinations.map((combination) => {
  const amps = combination.map((phase) => createAmp(phase, numbers))
  let output = 0

  for (let i = 0; i < 5; i++) {
    const [signal] = amps[i](output)
    output = signal
  }

  return output
})

console.log(Math.max(...outputs))
