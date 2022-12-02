import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.split('\n')

let points = 0
for (const line of lines) {
  const [opp, me] = line.split(' ')

  let round = 0
  switch (me) {
    case 'X':
      round += 1
      if (opp === 'A') {
        round += 3
      } else if (opp === 'C') {
        round += 6
      }
      break
    case 'Y':
      round += 2
      if (opp === 'A') {
        round += 6
      } else if (opp === 'B') {
        round += 3
      }
      break
    case 'Z':
      round += 3
      if (opp === 'B') {
        round += 6
      } else if (opp === 'C') {
        round += 3
      }
      break
  }

  points += round
}

console.log(points)
