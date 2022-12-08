import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const [numbers, ...rest] = input.split('\n\n')

const boards = rest.map((b) =>
  b.split('\n').map(
    (r) =>
      r
        .split(' ')
        .filter(Boolean)
        .map((c) => [+c, false]) as [number, boolean][]
  )
)

// this is an ungodly use of try/catch i apologize
const numbersArray = numbers.split(',').map((n) => +n)

try {
  for (const n of numbersArray) {
    for (const board of boards) {
      for (const row of board) {
        for (const char of row) {
          if (char[0] === n) {
            char[1] = true
          }
        }
      }
    }

    for (const board of boards) {
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (board[i][j][1]) {
            let bingo = true
            for (let k = 0; k < board.length; k++) {
              if (!board[k][j][1]) {
                bingo = false
                break
              }
            }
            if (bingo) {
              throw [board, n]
            }
            bingo = true
            for (let k = 0; k < board[i].length; k++) {
              if (!board[i][k][1]) {
                bingo = false
                break
              }
            }
            if (bingo) {
              throw [board, n]
            }
          }
        }
      }
    }
  }
} catch ([board, n]) {
  let num = 0
  for (const row of board) {
    for (const char of row) {
      if (!char[1]) num += char[0]
    }
  }
  console.log(num * n)
}
