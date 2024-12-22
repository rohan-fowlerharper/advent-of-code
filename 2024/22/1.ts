import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const numbers = input.trimEnd().split('\n').map(Number)

const prune = (n: bigint) => n % 16777216n
const mix = (n: bigint, m: bigint) => n ^ m
function secretify(input: number): number {
  let n = BigInt(input)

  n = mix(n, n * 64n)
  n = prune(n)

  n = mix(n, n / 32n)
  n = prune(n)

  n = mix(n, n * 2048n)
  n = prune(n)

  return Number(n)
}

function generate(secret: number, rounds: number) {
  for (let i = 0; i < rounds; i++) {
    secret = secretify(secret)
  }
  return secret
}

const result = numbers.map((n) => generate(n, 2000))

console.log(result.reduce((a, b) => a + b, 0))
