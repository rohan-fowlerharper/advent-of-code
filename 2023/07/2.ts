import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const cardOrder = [
  'A',
  'K',
  'Q',
  'T',
  '9',
  '8',
  '7',
  '6',
  '5',
  '4',
  '3',
  '2',
  'J',
]
const lines = input
  .trimEnd()
  .split('\n')
  .map((l) => l.split(' '))
  .map((l) => {
    const [cards, bid] = l
    return {
      cards: cards.split('') as Hand,
      bid: Number(bid),
    }
  })

type Hand = [string, string, string, string, string]

const getCardValue = (card: string) => {
  return cardOrder.indexOf(card)
}
type HandType =
  | 'FIVE_OF_A_KIND'
  | 'FOUR_OF_A_KIND'
  | 'FULL_HOUSE'
  | 'THREE_OF_A_KIND'
  | 'TWO_PAIR'
  | 'ONE_PAIR'
  | 'HIGH_CARD'
const handTypeOrder: HandType[] = [
  'FIVE_OF_A_KIND',
  'FOUR_OF_A_KIND',
  'FULL_HOUSE',
  'THREE_OF_A_KIND',
  'TWO_PAIR',
  'ONE_PAIR',
  'HIGH_CARD',
]

const isJoker = (card: string) => card === 'J'

const getHandType = (hand: Hand): HandType => {
  let jokers = 0
  const counts = new Map<string, number>()
  hand.forEach((card) => {
    if (isJoker(card)) {
      jokers++
    } else {
      counts.set(card, (counts.get(card) || 0) + 1)
    }
  })

  const max = Math.max(...counts.values(), 0) + jokers
  const min = Math.min(...counts.values())

  if (max === 5) return 'FIVE_OF_A_KIND'
  if (max === 4) return 'FOUR_OF_A_KIND'
  if (max === 3 && min === 2) return 'FULL_HOUSE'
  if (max === 3) return 'THREE_OF_A_KIND'
  if (max === 2 && counts.size === 3) return 'TWO_PAIR'
  if (max === 2 && counts.size === 4) return 'ONE_PAIR'
  return 'HIGH_CARD'
}

const sortedHands = lines
  .map((line) => {
    return {
      ...line,
      handType: getHandType(line.cards),
    }
  })
  .sort((a, b) => {
    const handTypeOrderA = handTypeOrder.indexOf(a.handType)
    const handTypeOrderB = handTypeOrder.indexOf(b.handType)

    if (handTypeOrderA === handTypeOrderB) {
      const cardValueA = a.cards.map(getCardValue)
      const cardValueB = b.cards.map(getCardValue)

      for (let i = 0; i < cardValueA.length; i++) {
        if (cardValueA[i] !== cardValueB[i]) {
          return cardValueA[i] - cardValueB[i]
        }
      }
    }

    return handTypeOrderA - handTypeOrderB
  })
  .toReversed()

const score = sortedHands.reduce((a, b, i) => {
  return a + b.bid * (i + 1)
}, 0)

console.log(score)
