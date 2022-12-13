import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'
const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const pairs = input
  .trimEnd()
  .split('\n\n')
  .map((l) => l.split('\n').map((t) => JSON.parse(t)))

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

const passes: number[] = []
for (let i = 0; i < pairs.length; i++) {
  const [lhs, rhs] = pairs[i]

  const isPass = check(lhs, rhs)
  if (isPass === 1) passes.push(i + 1)
}

console.log(passes.reduce((a, b) => a + b, 0))
