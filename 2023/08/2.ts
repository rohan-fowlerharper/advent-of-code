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

const distanceAtConvergence = lcmArray(distancesToEndWithZ)

console.log(distanceAtConvergence)

// TODO: add these to a utils file
function gcd(a: number, b: number): number {
  if (b === 0) return a
  return gcd(b, a % b)
}

function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b)
}

function lcmArray(numbers: number[]): number {
  return numbers.reduce((a, b) => lcm(a, b))
}
