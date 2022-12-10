import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input
  .split('\n')
  .map((l) => l.split(' | ').map((s) => s.split(' ')))
const easyNums = [2, 3, 4, 7]
const nums = []

for (const line of lines) {
  const [input, output] = line
  const all = input.concat(output)
  const uniques = all.filter((s) => easyNums.includes(s.length))
  const p = Array.from({ length: 7 }, () => '.')

  const overlap = (a: string, b: string) =>
    a.split('').filter((l) => b.includes(l)).length

  uniques.forEach((n) => {
    switch (n.length) {
      case 2:
        p[1] = n
        break
      case 3:
        p[7] = n
        break
      case 4:
        p[4] = n
        break
      case 7:
        p[8] = n
    }
  })

  p[6] = all.find((s) => s.length === 6 && overlap(p[1], s) === 1)!
  p[5] = all.find((s) => s.length === 5 && overlap(p[6], s) === 5)!
  p[3] = all.find((s) => s.length === 5 && overlap(p[5], s) === 4)!
  p[2] = all.find((s) => s.length === 5 && overlap(p[5], s) === 3)!
  p[9] = Array.from(new Set((p[5] + p[3]).split(''))).join('')
  p[0] = all.find(
    (s) =>
      s.length === 6 &&
      overlap(p[4], s) === 3 &&
      overlap(p[9], s) === 5 &&
      overlap(p[6], s) === 5
  )!

  const result = output.reduce((total, o) => {
    const n = p.find((p) => overlap(p, o) === Math.max(o.length, p.length))!
    return total + p.indexOf(n)
  }, '')

  nums.push(Number(result))
}

console.log(nums.reduce((t, n) => t + n, 0))
