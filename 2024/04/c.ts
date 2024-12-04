import { Point, get } from './2.ts'

/**
 * check
 */
export const c = ([x, y]: Point, letter: string) => {
  return get(x, y) === letter
}
