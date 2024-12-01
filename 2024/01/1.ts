import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.trimEnd().split('\n')

const listA: number[] = []
const listB: number[] = []
for (const line of lines) {
  const [a, b] = line.split(/\s+/).map(Number)
  listA.push(a)
  listB.push(b)
}

listA.sort()
listB.sort()

const diffs: number[] = []
for (let i = 0; i < listA.length; i++) {
  diffs.push(Math.abs(listB[i] - listA[i]))
}

console.log(diffs.reduce((acc, cur) => acc + cur, 0))
