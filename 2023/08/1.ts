import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

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
    .replaceAll('(', '')
    .replaceAll(')', '')
    .split(', ')

  map.set(locale, { left, right })
}

const start = 'AAA'
const end = 'ZZZ'

let distance = 0
let next = start
while (next !== end) {
  const { left, right } = map.get(next)!
  const direction = directions[distance % directions.length]
  next = direction === 'L' ? left : right
  distance++
}

console.log(distance)
