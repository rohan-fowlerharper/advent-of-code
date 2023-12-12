import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'
import { memoize } from 'utils'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input
  .trimEnd()
  .split('\n')
  .map((l) => {
    const [springs, groupsRaw] = l.split(' ')
    const groups = groupsRaw.split(',').map(Number)
    return { springs, groups }
  })

const countArrangements = (
  springs: string,
  groups: readonly number[]
): number => {
  if (springs.length === 0 && groups.length === 0) return 1
  if (springs.length < groups.reduce((a, b) => a + b, 0)) return 0
  if (groups.length === 0) {
    if (springs.includes('#')) return 0
    return 1
  }

  const firstSpring = springs[0]

  switch (firstSpring) {
    case '.':
      return countArrangements(springs.slice(1), groups)
    case '#': {
      const [firstGroup, ...otherGroups] = groups
      if (
        springs.slice(0, firstGroup).includes('.') ||
        springs[firstGroup] === '#'
      ) {
        return 0
      }

      return countArrangements(springs.slice(firstGroup + 1), otherGroups)
    }
    case '?':
    default:
      return (
        countArrangements('#' + springs.slice(1), groups) +
        countArrangements('.' + springs.slice(1), groups)
      )
  }
}

let result = 0
for (const line of lines) {
  const { springs, groups } = line
  result += countArrangements(springs, groups)
}

console.info(result)
