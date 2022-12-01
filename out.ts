import { format } from 'https://deno.land/std@0.91.0/datetime/mod.ts'

const file = Deno.args[0]
if (!file || (file !== '1' && file !== '2')) {
  console.log('Invalid file')
  Deno.exit(1)
}

const day = format(new Date(), 'd')
const dir = day.padStart(2, '0')

await Deno.run({
  cmd: ['deno', 'run', '--allow-read', '--watch', `./${dir}/${file}.ts`],
}).status()
