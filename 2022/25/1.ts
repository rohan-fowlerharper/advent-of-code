import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.trimEnd().split('\n')

const map: Record<string, number> = {
  '-': -1,
  '=': -2,
  0: 0,
  1: 1,
  2: 2,
}
const unmap: Record<string, string> = {
  '-1': '-',
  '-2': '=',
  '0': '0',
  '1': '1',
  '2': '2',
}

const snafu = (s: string) => {
  return s
    .split('')
    .reduceRight((t, c, i) => t + map[c] * 5 ** (s.length - i - 1), 0)
}

const desnafu = (n: number): string => {
  let s = ''
  while (n > 0) {
    let r = n % 5
    if (r >= 3) r -= 5
    s = unmap[r] + s
    n = (n - r) / 5
  }
  return s
}

let sum = 0
for (const line of lines) {
  sum += snafu(line)
}

console.log(desnafu(sum))
