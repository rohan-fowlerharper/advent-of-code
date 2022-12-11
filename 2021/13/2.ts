import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const [dotsStr, foldsStr] = input.trimEnd().split('\n\n')

const dots = dotsStr.split('\n').map((line) => line.split(',').map(Number))
const folds: [string, number][] = foldsStr.split('\n').map(
  (line) =>
    line
      .split(' ')
      .at(-1)!
      .split('=')
      .map((l) => (Number(l) ? Number(l) : l)) as [string, number]
)

const maxX = Math.max(...dots.map((dot) => dot[0]))
const maxY = Math.max(...dots.map((dot) => dot[1]))

const logPaper = (paper: string[][]) => {
  console.log(paper.map((row) => row.join('')).join('\n'))

  console.log('\n')
}

let paper = Array.from({ length: maxY + 1 }, () => Array(maxX + 1).fill('.'))

for (const [x, y] of dots) {
  paper[y][x] = '#'
}

for (const [axis, v] of folds) {
  for (const [y, row] of paper.entries()) {
    for (const [x, dot] of row.entries()) {
      if (dot !== '#') continue

      if (axis === 'y' && y > v) paper[2 * v - y][x] = '#'
      if (axis === 'x' && x > v) paper[y][2 * v - x] = '#'
    }
  }
  paper = paper
    .slice(0, axis === 'y' ? v : paper.length)
    .map((row) => row.slice(0, axis === 'x' ? v : row.length))
}

logPaper(paper)
