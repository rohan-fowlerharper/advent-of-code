import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const [min, max] = input.trimEnd().replaceAll('\n', '').split('-').map(Number)

const isIncreasing = (n: number) => {
  const s = n.toString()

  for (let i = 0; i < s.length - 1; i++) {
    if (s[i] > s[i + 1]) {
      return false
    }
  }

  return true
}

const hasDoubleStrict = (n: number) => {
  const s = n.toString()

  for (let i = 0; i < s.length - 1; i++) {
    if (s[i] === s[i + 1] && s[i] !== s[i - 1] && s[i] !== s[i + 2]) {
      return true
    }
  }

  return false
}

const count = (min: number, max: number) => {
  let count = 0

  for (let i = min; i <= max; i++) {
    if (isIncreasing(i) && hasDoubleStrict(i)) {
      count++
    }
  }

  return count
}

console.log(count(min, max))
