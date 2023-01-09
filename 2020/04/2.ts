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

const validEyeColors = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth']

const requiredFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']

const isValidHeight = (hgt: string) => {
  if (hgt.endsWith('cm')) {
    const height = Number(hgt.slice(0, -2))
    return height >= 150 && height <= 193
  } else if (hgt.endsWith('in')) {
    const height = Number(hgt.slice(0, -2))
    return height >= 59 && height <= 76
  }
  return false
}

// zoddddd pls
const valid = passports.filter((p) => {
  return (
    requiredFields.every((f) => p[f]) &&
    Number(p.byr) >= 1920 &&
    Number(p.byr) <= 2002 &&
    Number(p.iyr) >= 2010 &&
    Number(p.iyr) <= 2020 &&
    Number(p.eyr) >= 2020 &&
    Number(p.eyr) <= 2030 &&
    isValidHeight(p.hgt) &&
    p.hcl.startsWith('#') &&
    p.hcl.length === 7 &&
    p.hcl
      .slice(1)
      .split('')
      .every((c) => '0123456789abcdef'.includes(c)) &&
    validEyeColors.includes(p.ecl) &&
    p.pid.length === 9 &&
    p.pid.split('').every((c) => '0123456789'.includes(c))
  )
})

performance.mark('end')

console.log(valid.length)

console.log(
  `To parse: ${performance
    .measure('04.2', 'start', 'parsed')
    .duration.toFixed(3)}ms`
)

console.log(
  `To solve: ${performance
    .measure('04.2', 'parsed', 'end')
    .duration.toFixed(3)}ms`
)
