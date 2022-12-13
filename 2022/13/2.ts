import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'
const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const pairs = input
  .trimEnd()
  .split('\n\n')
  .map((l) => l.split('\n').map((t) => JSON.parse(t)))
  .flat()

type RecursiveNumberArray = (number | RecursiveNumberArray)[]

const check = (
  lhs: RecursiveNumberArray,
  rhs: RecursiveNumberArray
): number => {
  for (let i = 0; i < Math.max(lhs.length, rhs.length); i++) {
    let l = lhs[i]
    let r = rhs[i]

    if (r === undefined) return -1
    if (l === undefined) return 1

    if (typeof l === 'number' && typeof r === 'number') {
      if (l === r) continue
      return l < r ? 1 : -1
    }

    if (!Array.isArray(l)) l = [l]
    if (!Array.isArray(r)) r = [r]

    const isPass = check(l, r)
    if (isPass === 1) return 1
    if (isPass === 0) continue
    return -1
  }
  return 0
}

const one = [[2]]
const two = [[6]]

pairs.push(one, two)
pairs.sort((a, b) => check(b, a))

const i1 = pairs.findIndex((p) => p === one) + 1
const i2 = pairs.findIndex((p) => p === two) + 1
console.log(i1 * i2)
