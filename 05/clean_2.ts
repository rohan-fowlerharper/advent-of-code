import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'
import {
  createBuckets,
  getLastLetters,
  moveLettersWithCrane9001,
  parseFile,
} from './lib.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.split('\n').filter(Boolean)

const { commands, grid } = parseFile(lines)

const buckets = createBuckets(grid)

moveLettersWithCrane9001(buckets, commands)

const lastLetters = getLastLetters(buckets)

console.log(lastLetters)
