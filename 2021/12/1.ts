import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.trimEnd().split('\n')

const connections: Record<string, string[]> = {}
lines.forEach((l) => {
  const [a, b] = l.split('-')
  if (!connections[a]) connections[a] = []
  if (!connections[b]) connections[b] = []

  connections[a].push(b)
  connections[b].push(a)
})

type Path = {
  path: string[]
}
const stack: Path[] = [
  {
    path: ['start'],
  },
]
const paths: string[] = []

while (stack.length > 0) {
  const { path } = stack.pop()!
  const node = connections[path.at(-1)!]

  for (const neighbour of node) {
    if (neighbour === 'end') {
      paths.push(path.join(',') + ',end')
      continue
    }

    if (neighbour.toLowerCase() === neighbour && path.includes(neighbour))
      continue

    stack.push({
      path: [...path, neighbour],
    })
  }
}

console.log(paths, paths.length)
