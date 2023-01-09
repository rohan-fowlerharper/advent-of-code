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

const doesTerminate = (lines: { command: string; value: number }[]) => {
  const visited = new Set<number>()
  let acc = 0
  let i = 0
  while (true) {
    if (i >= lines.length) return { terminates: true, acc }
    if (visited.has(i)) return { terminates: false }

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
}

for (let i = 0; i < lines.length; i++) {
  const { command, value } = lines[i]
  if (command === 'acc') continue

  const newLines = [...lines]
  newLines[i] = { command: command === 'jmp' ? 'nop' : 'jmp', value }

  const { terminates, acc } = doesTerminate(newLines)

  if (terminates) {
    performance.mark('end')
    console.log(acc)
    break
  }
}

console.log(
  `To parse: ${performance
    .measure('08.2', 'start', 'parsed')
    .duration.toFixed(3)}ms`
)

console.log(
  `To solve: ${performance
    .measure('08.2', 'parsed', 'end')
    .duration.toFixed(3)}ms`
)
