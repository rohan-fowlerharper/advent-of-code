import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

performance.mark('start')

const passports: Array<{ [key: string]: string }> = input
  .trimEnd()
  .split('\n\n')
  .map((p) => {
    const fields = p
      .replaceAll('\n', ' ')
      .split(' ')
      .map((f) => f.split(':'))

    return Object.fromEntries(fields)
  })

performance.mark('parsed')

const requiredFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']

const valid = passports.filter((p) => {
  return requiredFields.every((f) => p[f])
})

performance.mark('end')

console.log(valid.length)

console.log(
  `To parse: ${performance
    .measure('04.1', 'start', 'parsed')
    .duration.toFixed(3)}ms`
)

console.log(
  `To solve: ${performance
    .measure('04.1', 'parsed', 'end')
    .duration.toFixed(3)}ms`
)
