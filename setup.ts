import { format } from 'https://deno.land/std@0.91.0/datetime/mod.ts'

let [day, year] = format(new Date(), 'd,yyyy').split(',')

if (Deno.args[0] && Deno.args[1]) {
  year = Deno.args[0]
  day = Deno.args[1]
} else if (Deno.args[0] || Deno.args[1]) {
  console.log('Invalid arguments')
  Deno.exit(1)
}

const dir = `${year}/${day.padStart(2, '0')}`

const encoder = new TextEncoder()
const data =
  encoder.encode(`import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.trimEnd().split('\\n')
`)

await Deno.mkdir(dir, { recursive: true })
await Deno.create(`./${dir}/input.txt`)
await Deno.writeFile(`./${dir}/1.ts`, data)
await Deno.writeFile(`./${dir}/2.ts`, data)
