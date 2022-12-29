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

const contains = (bag: string): number => {
  const contents = bags.get(bag)
  if (!contents) return 0
  return contents.reduce((total, c) => {
    return total + c.count + c.count * contains(c.name)
  }, 0)
}

const answer = contains('shiny gold')

console.log(answer)
