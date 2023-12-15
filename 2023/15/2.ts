import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const values = input.trimEnd().split(',')

const hash = (value: string) => {
  let current = 0
  for (const char of value) {
    const ascii = char.charCodeAt(0)
    current += ascii
    current *= 17
    current %= 256
  }
  return current
}

type Lens = {
  label: string
  focalLength: number
}

const boxes: Lens[][] = Array.from({ length: 256 }, () => [])

function performStep(value: string) {
  const [label, focalLengthStr] = value.split(/-|=/)
  const focalLength = Number(focalLengthStr)
  const boxIndex = hash(label)
  const box = boxes[boxIndex]

  if (!focalLength) {
    // is a '-'
    boxes[boxIndex] = box.filter((lens) => lens.label !== label)
    return
  }

  const lens = box.find((lens) => lens.label === label)
  if (lens) {
    lens.focalLength = focalLength
  } else {
    box.push({ label, focalLength })
  }
}

for (const value of values) {
  performStep(value)
}

const totalFocusingPower = boxes.reduce((total, box, boxIndex) => {
  const boxNumber = boxIndex + 1
  const boxFocusingPower = box.reduce((boxTotal, lens, slotIndex) => {
    const slotNumber = slotIndex + 1
    return boxTotal + boxNumber * slotNumber * lens.focalLength
  }, 0)
  return total + boxFocusingPower
}, 0)

console.log(totalFocusingPower)
