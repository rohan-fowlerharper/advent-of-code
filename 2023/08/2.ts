import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'
import { lcm } from '../../utils/math.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const [directions, lines] = input.trimEnd().split('\n\n')

const map = new Map<
  string,
  {
    left: string
    right: string
  }
>()

for (const line of lines.split('\n')) {
  const [locale, leftAndRight] = line.split(' = ')
  const [left, right] = leftAndRight
    .replace('(', '')
    .replace(')', '')
    .split(', ')

  map.set(locale, { left, right })
}

const localesEndingInA = [...map.keys()].filter((locale) =>
  locale.endsWith('A')
)

const distancesToEndWithZ = localesEndingInA.map((locale) => {
  let distance = 0
  let next = locale

  while (!next.endsWith('Z')) {
    const { left, right } = map.get(next)!
    const direction = directions[distance % directions.length]
    next = direction === 'L' ? left : right
    distance++
  }
  return distance
})

// LCM works because XXA - XXZ is the same period as XXZ - XXZ
const distanceAtConvergence = lcm(...distancesToEndWithZ)

console.log(distanceAtConvergence)
