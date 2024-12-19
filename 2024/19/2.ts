import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const [patternsRaw, designsRaw] = input.trimEnd().split('\n\n')

const patterns = patternsRaw.split(', ')
const designs = designsRaw.split('\n')

function canMakeCount(
  target: string,
  memo = new Map<string, number>()
): number {
  if (target === '') return 1
  if (memo.has(target)) return memo.get(target)!

  const count = patterns.reduce(
    (total, p) =>
      target.startsWith(p)
        ? total + canMakeCount(target.slice(p.length), memo)
        : total,
    0
  )

  memo.set(target, count)
  return count
}

const result = designs.reduce(
  (total, design) => total + canMakeCount(design),
  0
)

console.log(result)
