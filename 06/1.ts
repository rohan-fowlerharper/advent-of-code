import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

// const lines = input.split('\n')

for (let i = 4; i < input.length; i++) {
  let unique = true
  for (let j = i; j >= i - 4; j--) {
    for (let k = i; k >= i - 4; k--) {
      if (j !== k && input[j] === input[k]) {
        unique = false
        break
      }
    }
    if (!unique) {
      break
    }
  }

  if (unique) {
    console.log(i)
    break
  }
}
