import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

let [polymer, pairsStr] = input.trimEnd().split('\n\n')

const pairs: Record<string, string> = {}

pairsStr.split('\n').forEach((line) => {
  const [pair, result] = line.split(' -> ')
  pairs[pair] = result
})

for (let step = 1; step <= 10; step++) {
  let nextPolymer = ''

  for (let i = 0; i < polymer.length; i++) {
    const pair = polymer.slice(i, i + 2)
    nextPolymer += polymer[i]
    if (pair.length !== 2) continue
    nextPolymer += pairs[pair]
  }

  polymer = nextPolymer
}

const quantities: Record<string, number> = {}

polymer.split('').forEach((char) => {
  quantities[char] = (quantities[char] || 0) + 1
})

const max = Math.max(...Object.values(quantities))
const min = Math.min(...Object.values(quantities))
const result = max - min
console.log(result)
