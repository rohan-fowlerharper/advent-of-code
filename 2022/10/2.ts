import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.split('\n')

let cycles = 1
let X = 1
const cycle = () => {
  const row = Math.floor(cycles / 40)
  const pos = (cycles % 40) - 1
  if (row >= 6) return
  if (Math.abs(X - pos) < 2) {
    screen[row][pos] = '#'
  } else {
    screen[row][pos] = '.'
  }
  cycles++
}

const screen = Array.from({ length: 6 }, () => [] as string[])

const logScreen = () => {
  console.log(screen.map((line) => line.join('')).join('\n'))
  console.log('\n\n')
}

for (const line of lines) {
  cycle()
  if (line === 'noop') continue

  cycle()
  X += Number(line.split(' ')[1])
}

logScreen()
