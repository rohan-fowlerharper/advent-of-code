import { Point } from './2.ts'

const key = (
  pointTL: Point,
  pointTR: Point,
  pointBL: Point,
  pointBR: Point
) => {
  return `${pointTL[0]}-${pointTL[1]}-${pointTR[0]}-${pointTR[1]}-${pointBL[0]}-${pointBL[1]}-${pointBR[0]}-${pointBR[1]}`
}
