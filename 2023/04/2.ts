import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.trimEnd().split('\n')

const cards = lines.map((l) => {
  const [, cards] = l.split(': ')
  const [winningCards, yours] = cards
    .split(' | ')
    .map((c) => c.split(' ').filter(Boolean).map(Number))

  return { winningSet: new Set(winningCards), yours }
})

const scratchies: number[] = cards.map(() => 1)
cards.forEach(({ winningSet, yours }, cardNumber) => {
  const winningCount = yours.filter((c) => winningSet.has(c)).length

  if (winningCount === 0) return

  for (
    let nextCardNumber = cardNumber + 1;
    nextCardNumber <= cardNumber + winningCount;
    nextCardNumber++
  ) {
    scratchies[nextCardNumber] += scratchies[cardNumber]
  }
})

const result = scratchies.reduce((a, b) => a + b, 0)
console.log(result)
