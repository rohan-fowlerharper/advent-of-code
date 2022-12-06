import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.split('\n')

let count = 0
const windows = []
for (let i = 0; i < lines.length; i++) {
  if (lines[i] === '') continue

  const window = lines.slice(i - 3, i).reduce((a, b) => a + parseInt(b), 0)

  windows.push(window)
}

for (let i = 0; i < windows.length; i++) {
  if (windows[i] > windows[i - 1]) {
    count++
  }
}

console.log(count)
