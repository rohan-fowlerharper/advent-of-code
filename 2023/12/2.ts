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

const countArrangements = memoize(
  (springs: string, groups: readonly number[]): number => {
    if (springs.length === 0 && groups.length === 0) return 1
    if (springs.length === 0) return 0
    if (groups.length === 0) {
      if (springs.includes('#')) return 0
      return 1
    }
    if (springs.length < groups.reduce((a, b) => a + b)) return 0

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
)

let result = 0
for (const line of lines) {
  const { springs, groups } = line

  const springsUnfolded = [springs, springs, springs, springs, springs]
    .join('?')
    .replace(/\./g, '.')
  const groupsUnfolded = [...groups, ...groups, ...groups, ...groups, ...groups]

  result += countArrangements(springsUnfolded, groupsUnfolded)
}

console.info(result)
