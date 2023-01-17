import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const [rawRules, messages] = input
  .trimEnd()
  .split('\n\n')
  .map((g) => g.split('\n'))

type Rules = string[]
type Rule = string | [Rules, Rules] | Rules

const rules = new Map<string, string>(
  rawRules.map((rule) => {
    const [id, rest] = rule.split(': ')
    return [id, rest.replaceAll('"', '')]

    // if (rest.startsWith('"')) {
    //   return [id, rest.slice(1, -1)]
    // }
    // if (rest.includes('|')) {
    //   return [id, rest.split(' | ').map((r) => r.split(' ')) as [Rules, Rules]]
    // }
    // return [id, rest.split(' ') as Rules]
  })
)

const message = 'ababbb'
