import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

performance.mark('start')

const lines = input
  .trimEnd()
  .split('\n')
  .map((l) => {
    const [command, value] = l.split(' ')
    return { command, value: Number(value) }
  })

performance.mark('parsed')

let acc = 0
const visited = new Set<number>()

let i = 0
while (true) {
  if (visited.has(i)) {
    performance.mark('end')
    console.log(acc)
    break
  }

  visited.add(i)

  const { command, value } = lines[i]
  switch (command) {
    case 'acc':
      acc += value
      i++
      break
    case 'jmp':
      i += value
      break
    case 'nop':
      i++
      break
  }
}

console.log(
  `To parse: ${performance
    .measure('08.1', 'start', 'parsed')
    .duration.toFixed(3)}ms`
)

console.log(
  `To solve: ${performance
    .measure('08.1', 'parsed', 'end')
    .duration.toFixed(3)}ms`
)
