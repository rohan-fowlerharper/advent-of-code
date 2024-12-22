import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'
import { CountedSet } from 'utils'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)
const numbers = input.trimEnd().split('\n').map(Number)

type Results = Map<string, number>

const prune = (n: bigint) => n % 16777216n
const mix = (n: bigint, m: bigint) => n ^ m
function secretify(input: number) {
  let n = BigInt(input)
  n = prune(mix(n, n * 64n))
  n = prune(mix(n, n / 32n))
  n = prune(mix(n, n * 2048n))
  return Number(n)
}

function generate(secret: number, rounds: number) {
  const results: Results = new Map()
  const seq: number[] = []
  let prev = secret % 10

  for (let i = 0; i < rounds; i++) {
    secret = secretify(secret)
    const curr = secret % 10
    const diff = curr - prev

    seq.push(diff)
    if (seq.length > 4) {
      seq.shift()
    }

    if (seq.length === 4) {
      const key = seq.join(',')
      if (!results.has(key)) {
        results.set(key, curr)
      }
    }

    prev = curr
  }

  return results
}

const sequences = new CountedSet<string>()

for (const n of numbers) {
  const prices = generate(n, 2000)

  for (const [sequence, price] of prices) {
    sequences.add(sequence, price)
  }
}

let bestSequence = ''
let bestPrice = 0

for (const [sequence, price] of sequences) {
  if (price > bestPrice) {
    bestSequence = sequence
    bestPrice = price
  }
}

console.log(bestSequence, bestPrice)
