import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const line = input.trimEnd()

const regex = /mul\((\d{1,3}),(\d{1,3})\)|do\(\)|don't\(\)/g

let match: RegExpExecArray | null
let enabled = true
let total = 0
while ((match = regex.exec(line)) !== null) {
  if (match[0].startsWith('mul') && enabled) {
    total += Number(match[1]) * Number(match[2])
  } else if (match[0] === 'do()') {
    enabled = true
  } else if (match[0] === "don't()") {
    enabled = false
  }
}

console.log(total)
