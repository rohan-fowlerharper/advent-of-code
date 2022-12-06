export const parseFile = (lines: string[]) => {
  const separator = lines.findIndex((l) => l.startsWith(' 1'))

  const commands = lines
    .slice(separator + 1)
    .map((c) => c.split(' ').map(Number).filter(Boolean))

  const grid = lines.slice(0, separator).map((l) =>
    l
      .replace(/\s\s/g, ' ')
      .replace(/\[/g, '')
      .replace(/\]/g, '')
      .split('')
      .filter((_, i) => i % 2 !== 1)
  )
  return { commands, grid }
}

export const createBuckets = (grid: string[][]) => {
  const numberCols = Number(grid.at(0)!.length)

  const buckets = Array.from({ length: numberCols }, () => []) as string[][]

  for (let i = grid.length; i > 0; i--) {
    const letters = grid[i - 1]

    for (let j = 0; j < letters.length; j++) {
      const letter = letters[j]
      if (letter === ' ') continue
      buckets[j].push(letter)
    }
  }

  return buckets
}

export const getLastLetters = (buckets: string[][]) =>
  buckets.map((b) => b[b.length - 1]).join('')

export const moveLettersWithCrane9000 = (
  buckets: string[][],
  commands: number[][]
) => {
  for (const command of commands) {
    const [num, from, to] = command

    for (let i = 0; i < num; i++) {
      const fromBucket = buckets[from - 1]
      const toBucket = buckets[to - 1]

      const letter = fromBucket.pop()
      toBucket.push(letter!)
    }
  }
}

export const moveLettersWithCrane9001 = (
  buckets: string[][],
  commands: number[][]
) => {
  for (const command of commands) {
    const [num, from, to] = command

    const fromBucket = buckets[from - 1]
    const toBucket = buckets[to - 1]

    const letters = fromBucket.splice(fromBucket.length - num, num)

    toBucket.push(...letters)
  }
}
