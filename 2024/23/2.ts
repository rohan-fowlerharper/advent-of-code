import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const graph = new Map<string, Group>()

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

const groups: Set<string> = new Set()
const nodes = [...graph.keys()]

for (const start of nodes) {
  const minSize = 3
  const maxSize = graph.get(start)!.size + 1

  for (let size = minSize; size <= maxSize; size++) {
    const current = new Set([start])

    for (const node of graph.get(start)!) {
      if (current.values().every((n) => graph.get(node)!.has(n))) {
        current.add(node)
      }
    }

    if (
      current
        .values()
        .every(
          (n) => graph.get(n)!.intersection(current).size === current.size - 1
        )
    ) {
      groups.add([...current].sort().join(','))
    }
  }
}

const largest = groups.values().reduce((a, b) => (a.length > b.length ? a : b))

console.log(largest)
