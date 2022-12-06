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
      round += 0
      if (opp === 'A') {
        round += 3
      } else if (opp === 'B') {
        round += 1
      } else {
        round += 2
      }
      break
    case 'Y':
      round += 3
      if (opp === 'A') {
        round += 1
      } else if (opp === 'B') {
        round += 2
      } else {
        round += 3
      }
      break
    case 'Z':
      round += 6
      if (opp === 'A') {
        round += 2
      } else if (opp === 'B') {
        round += 3
      } else {
        round += 1
      }
      break
  }
  console.log(opp, me, round)
  points += round
}

console.log(points)
