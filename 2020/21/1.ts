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

const allergenMap = new Map<string, string[]>()
for (const { ingredients, allergens } of recipes) {
  for (const allergen of allergens) {
    if (allergenMap.has(allergen)) {
      allergenMap.set(
        allergen,
        allergenMap.get(allergen)!.filter((i) => ingredients.includes(i))
      )
    } else {
      allergenMap.set(allergen, ingredients)
    }
  }
}

const allergens = new Set<string>()
for (const [_, ingredients] of allergenMap) {
  for (const ingredient of ingredients) {
    allergens.add(ingredient)
  }
}

const count = recipes.reduce((acc, { ingredients }) => {
  return acc + ingredients.filter((i) => !allergens.has(i)).length
}, 0)

console.log(count)
