import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.trimEnd().split('\n')

const recipes = lines.map((l) => {
  const [i, a] = l.split(' (contains ')
  return {
    ingredients: i.split(' '),
    allergens: a.slice(0, -1).split(', '),
  }
})

const possibleAllergens = new Map<string, string[]>()
for (const { ingredients, allergens } of recipes) {
  for (const allergen of allergens) {
    if (possibleAllergens.has(allergen)) {
      possibleAllergens.set(
        allergen,
        possibleAllergens.get(allergen)!.filter((i) => ingredients.includes(i))
      )
    } else {
      possibleAllergens.set(allergen, ingredients)
    }
  }
}

const allergens = new Map<string, string>()

while (true) {
  if (possibleAllergens.size === 0) {
    break
  }

  const singleAllergen = [...possibleAllergens.entries()].find(
    ([_, ingredients]) => ingredients.length === 1
  )
  if (!singleAllergen) {
    throw new Error('No single allergen found')
  }
  const [allergen, [ingredient]] = singleAllergen
  for (const [a, i] of possibleAllergens) {
    if (a !== allergen) {
      possibleAllergens.set(
        a,
        i.filter((i) => i !== ingredient)
      )
    }
  }

  allergens.set(allergen, ingredient)
  possibleAllergens.delete(allergen)
}

const sortedAllergens = [...allergens.entries()].sort((a, b) => {
  return a[0].localeCompare(b[0])
})

console.log(sortedAllergens.map((a) => a[1]).join(','))
