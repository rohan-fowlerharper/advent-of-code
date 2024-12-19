import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const [patternsRaw, designsRaw] = input.trimEnd().split('\n\n')

const patterns = patternsRaw.split(', ')

const designs = designsRaw.split('\n')

function canMake(target: string): boolean {
  if (target === '') return true

  return patterns.some(
    (p) => target.startsWith(p) && canMake(target.slice(p.length))
  )
}

const result = designs.filter(canMake).length

console.log(result)
