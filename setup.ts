import { format } from 'https://deno.land/std@0.91.0/datetime/mod.ts'

const day = format(new Date(), 'd')

const dir = day.padStart(2, '0')

const encoder = new TextEncoder()
const data =
  encoder.encode(`import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'
export {}

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.split('\\n')
`)

await Deno.mkdir(dir)
await Deno.create(`./${dir}/input.txt`)
await Deno.writeFile(`./${dir}/1.ts`, data)
await Deno.writeFile(`./${dir}/2.ts`, data)
