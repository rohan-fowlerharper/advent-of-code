import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const passports: { [key: string]: string }[] = input
  .trimEnd()
  .split('\n\n')
  .map((p) => {
    const fields = p
      .replaceAll('\n', ' ')
      .split(' ')
      .map((f) => f.split(':'))

    return Object.fromEntries(fields)
  })

const requiredFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']

const valid = passports.filter((p) => {
  return requiredFields.every((f) => p[f])
})

console.log(valid.length)
