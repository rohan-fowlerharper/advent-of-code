import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const graph = new Map<string, Set<string>>()

input
  .trimEnd()
  .split('\n')
  .forEach((line) => {
    const [l, r] = line.split('-')

    if (!graph.has(l)) graph.set(l, new Set())
    if (!graph.has(r)) graph.set(r, new Set())

    graph.get(l)!.add(r)
    graph.get(r)!.add(l)
  })

const triplets = new Set<string>()
for (const [a, connected] of graph) {
  for (const b of connected) {
    for (const c of graph.get(b)!) {
      if (c !== a && connected.has(c)) {
        const triplet = [a, b, c].sort().join(',')
        triplets.add(triplet)
      }
    }
  }
}

const result = [...triplets].filter((t) =>
  t.split(',').some((n) => n.startsWith('t'))
).length

console.log(result)
