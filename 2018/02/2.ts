import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.trimEnd().split('\n')
const sorted = lines.sort((a, b) => a.localeCompare(b))

for (let i = 0; i < sorted.length; i++) {
  const id = sorted[i]
  const nextId = sorted[i + 1]

  let diff = 0
  let diffIndex = -1

  for (let j = 0; j < id.length; j++) {
    if (id[j] !== nextId[j]) {
      diff += 1
      diffIndex = j
    }
  }

  if (diff === 1) {
    console.log(id.slice(0, diffIndex) + id.slice(diffIndex + 1))
    break
  }
}
