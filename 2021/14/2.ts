import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const [start, pairsStr] = input.trimEnd().split('\n\n')

const transpose: Record<string, string> = {}

pairsStr.split('\n').forEach((line) => {
  const [pair, result] = line.split(' -> ')
  transpose[pair] = result
})

let pairOccurrences: Record<string, number> = {}
const quantities: Record<string, number> = {}

for (let i = 0; i < start.length; i++) {
  const char = start[i]
  quantities[char] = (quantities[char] || 0) + 1
  const pair = start.slice(i, i + 2)

  if (pair.length !== 2) continue
  pairOccurrences[pair] = (pairOccurrences[pair] || 0) + 1
}

for (let step = 1; step <= 40; step++) {
  const newPairOccurrences: Record<string, number> = {}
  Object.keys(pairOccurrences).forEach((pair) => {
    if (pairOccurrences[pair] === 0) return

    const newChar = transpose[pair]

    const pair1 = pair[0] + newChar
    const pair2 = newChar + pair[1]

    quantities[newChar] = (quantities[newChar] || 0) + pairOccurrences[pair]

    newPairOccurrences[pair1] =
      (newPairOccurrences[pair1] || 0) + pairOccurrences[pair]

    newPairOccurrences[pair2] =
      (newPairOccurrences[pair2] || 0) + pairOccurrences[pair]
  })
  pairOccurrences = newPairOccurrences
}

const max = Math.max(...Object.values(quantities))
const min = Math.min(...Object.values(quantities))
const result = max - min
console.log(result)
