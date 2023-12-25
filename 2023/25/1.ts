import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input
  .trimEnd()
  .split('\n')
  .map((l) => {
    const [wire, connections] = l.split(': ')
    return [wire, new Set([...connections.split(' ')])] as const
  })

const map = new Map<string, Set<string>>(lines)
for (const line of lines) {
  const [wire, connections] = line
  for (const connection of connections) {
    if (map.has(connection)) {
      map.get(connection)!.add(wire)
    } else {
      map.set(connection, new Set([wire]))
    }
  }
}

// use 1.py to find the 3 nearly dwarfed connections
map.get('kns')!.delete('dct')
map.get('jxb')!.delete('ksq')
map.get('nqq')!.delete('pxp')

map.get('dct')!.delete('kns')
map.get('ksq')!.delete('jxb')
map.get('pxp')!.delete('nqq')

const getGraphSize = (start: string) => {
  const set = new Set<string>()
  const queue = [start]
  while (queue.length > 0) {
    const current = queue.shift()!
    set.add(current)
    for (const connection of map.get(current)!) {
      if (!set.has(connection)) {
        queue.push(connection)
      }
    }
  }
  return set.size
}

console.log(getGraphSize('dct') * getGraphSize('kns'))
