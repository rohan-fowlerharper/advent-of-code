import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

type Reaction = {
  inputs: { amount: number; chemical: string }[]
  amount: number
  available: number
}
const listOfReactions = input
  .trimEnd()
  .split('\n')
  .map((l) => {
    const [lhs, rhs] = l.split(' => ')
    const [amount, chemical] = rhs.split(' ')
    const inputs = lhs.split(', ').map((l) => {
      const [amount, chemical] = l.split(' ')
      return { amount: Number(amount), chemical }
    })
    return [chemical, { inputs, amount: Number(amount), available: 0 }] as [
      string,
      Reaction
    ]
  })

const reactions = new Map(listOfReactions)

const ore = 'ORE'
const fuel = 'FUEL'

const getOre = (chemical: string, amount: number): number => {
  if (chemical === ore) return amount

  const reaction = reactions.get(chemical)!
  const { inputs, amount: reactionAmount, available } = reaction

  if (available >= amount) {
    reaction.available -= amount
    return 0
  }

  const needed = amount - available
  const times = Math.ceil(needed / reactionAmount)
  const produced = times * reactionAmount
  reaction.available = produced - needed

  return inputs.reduce((acc, curr) => {
    const { amount, chemical } = curr
    return acc + getOre(chemical, amount * times)
  }, 0)
}

const result = getOre(fuel, 1)

console.log(result)
