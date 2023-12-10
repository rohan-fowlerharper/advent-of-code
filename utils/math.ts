export function gcd(a: number, b: number): number {
  if (b === 0) return a
  return gcd(b, a % b)
}

export function lcm(...numbers: number[]): number {
  return numbers.reduce((a, b) => (a * b) / gcd(a, b))
}
