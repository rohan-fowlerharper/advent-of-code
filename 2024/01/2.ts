import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'
import { sum } from 'utils'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.trimEnd().split('\n')

const listA: number[] = []
const listBOccurrences = new Map<number, number>()
for (const line of lines) {
  const [a, b] = line.split(/\s+/).map(Number)
  listA.push(a)
  listBOccurrences.set(b, (listBOccurrences.get(b) ?? 0) + 1)
}

listA.sort()

const totals: number[] = []
for (let i = 0; i < listA.length; i++) {
  const value = listA[i]
  totals.push(value * (listBOccurrences.get(value) ?? 0))
}

console.log(sum(totals))
