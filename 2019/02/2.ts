import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const numbers = input.trimEnd().split('\n')[0].split(',').map(Number)

const generate = (noun: number, verb: number) => {
  const arr = [...numbers]
  arr[1] = noun
  arr[2] = verb

  for (let i = 0; arr[i] !== 99; i += 4) {
    const op = arr[i]
    const a = arr[arr[i + 1]]
    const b = arr[arr[i + 2]]
    const c = arr[i + 3]

    if (op === 1) {
      arr[c] = a + b
    }

    if (op === 2) {
      arr[c] = a * b
    }
  }

  return arr[0]
}

// lol
while (true) {
  const noun = Math.floor(Math.random() * 100)
  const verb = Math.floor(Math.random() * 100)
  if (generate(noun, verb) === 19690720) {
    console.log(100 * noun + verb)
    break
  }
}
