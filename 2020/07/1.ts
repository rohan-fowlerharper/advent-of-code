import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

type Contents = { count: number; name: string }
const bags = new Map<string, Contents[] | null>()
input
  .trimEnd()
  .split('\n')
  .forEach((l) => {
    const [bag, _contents] = l.split(' bags contain ')
    if (_contents.includes('no other')) {
      bags.set(bag, null)
      return
    }
    const contents = _contents.split(', ').map((c) => {
      const [count, ...rest] = c.split(' ')
      const name = rest.join(' ').replace(/ bags?\.?$/, '')
      return { count: Number(count), name }
    })

    bags.set(bag, contents)
  })

const canContain = (bag: string, target: string): boolean => {
  const contents = bags.get(bag)
  if (!contents) return false
  if (contents.some((c) => c.name === target)) return true
  return contents.some((c) => canContain(c.name, target))
}

const answer = [...bags.keys()].reduce((total, bag) => {
  if (canContain(bag, 'shiny gold')) return total + 1
  return total
}, 0)

console.log(answer)
