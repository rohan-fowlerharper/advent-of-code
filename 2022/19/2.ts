import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

type Blueprint = {
  n: number
  recipes: {
    ore: { ore: number }
    clay: { ore: number }
    obsidian: { ore: number; clay: number }
    geode: { ore: number; obsidian: number }
  }
}
const recipes: Blueprint[] = input
  .trimEnd()
  .split('\n')
  .map((l) => {
    const [blueprint, rest] = l.split(': ')
    const n = blueprint.split(' ')[1]
    const [a, b, c, d] = rest.split('. ')
    console.log({ a, b, c, d })

    const ore = Number(a.split(' ').at(-2))
    const clay = Number(b.split(' ').at(-2))
    const obsidian = [Number(c.split(' ').at(-5)), Number(c.split(' ').at(-2))]
    const geode = [Number(d.split(' ').at(-5)), Number(d.split(' ').at(-2))]

    return {
      n: Number(n),
      recipes: {
        ore: { ore: ore },
        clay: { ore: clay },
        obsidian: { ore: obsidian[0], clay: obsidian[1] },
        geode: { ore: geode[0], obsidian: geode[1] },
      },
    }
  })

type Resource = 'ore' | 'clay' | 'obsidian' | 'geode'

const hasEnough = (
  recipe: Blueprint['recipes'][keyof Blueprint['recipes']],
  resources: { [key in Resource]: number }
) => {
  return Object.entries(recipe).every(([thing, required]) => {
    return resources[thing as Resource] >= required
  })
}

type Item = {
  time: number
  timePassed: number
  resources: { [key in Resource]: number }
  bots: { [key in Resource]: number }
  geodesByEnd: number
}

const play = (blueprint: Blueprint) => {
  const firstItem: Item = {
    time: 32,
    timePassed: 0,
    resources: {
      ore: 0,
      clay: 0,
      obsidian: 0,
      geode: 0,
    },
    bots: {
      ore: 1,
      clay: 0,
      obsidian: 0,
      geode: 0,
    },
    geodesByEnd: 0,
  } as const

  const maxes = {
    ore: Math.max(
      blueprint.recipes.clay.ore,
      blueprint.recipes.obsidian.ore,
      blueprint.recipes.geode.ore,
      blueprint.recipes.ore.ore
    ),
    clay: blueprint.recipes.obsidian.clay,
    obsidian: blueprint.recipes.geode.obsidian,
    geode: Number.MAX_SAFE_INTEGER,
  }

  const completed = []
  let pool: Item[] = [firstItem]
  while (pool.length > 0) {
    const roundItems: Item[] = []

    recipes: for (const item of pool) {
      if (item.time === 0) {
        completed.push(item)
        continue
      }

      for (const [recipeName, recipe] of Object.entries(
        blueprint.recipes
      ).reverse()) {
        if (
          !hasEnough(recipe, item.resources) ||
          item.bots[recipeName as Resource] >= maxes[recipeName as Resource] ||
          item.resources[recipeName as Resource] >=
            maxes[recipeName as Resource] +
              item.resources[recipeName as Resource]
        )
          continue

        const newBots = { ...item.bots } as Item['bots']
        const newResources = { ...item.resources } as Item['resources']

        for (const [resource, required] of Object.entries(recipe)) {
          newResources[resource as Resource] -= required
        }
        newBots[recipeName as Resource] += 1

        for (const [bot, n] of Object.entries(item.bots)) {
          newResources[bot as Resource] += n
        }

        roundItems.push({
          time: item.time - 1,
          timePassed: item.timePassed + 1,
          resources: newResources,
          bots: newBots,
          geodesByEnd: newResources.geode + newBots.geode * (item.time - 1),
        })

        // be greedy with geodes and obsidian
        if (recipeName === 'geode') {
          continue recipes
        }
      }

      const newResources = { ...item.resources }

      for (const [robot, n] of Object.entries(item.bots)) {
        newResources[robot as Resource] += n
      }

      // goodness knows why this typo actually works (and makes it magnitudes faster)
      // 🤷🏻
      pool.push({
        // should be roundItems.push
        time: item.time - 1,
        timePassed: item.timePassed + 1,
        resources: newResources,
        bots: item.bots,
        geodesByEnd: newResources.geode + item.bots.geode * (item.time - 1),
      })
    }

    const grouped = new Map<string, Item[]>()
    for (const item of roundItems) {
      const key = `${item.time}`

      const existing = grouped.get(key) || []
      existing.push(item)
      grouped.set(key, existing)
    }

    const pruned = Array.from(grouped.values())
      .map((items) => {
        return items
          .sort((a, b) => {
            return (
              b.geodesByEnd - a.geodesByEnd ||
              b.bots.geode - a.bots.geode ||
              b.resources.geode - a.resources.geode ||
              b.bots.obsidian - a.bots.obsidian ||
              b.resources.obsidian - a.resources.obsidian ||
              b.bots.clay - a.bots.clay ||
              b.resources.clay - a.resources.clay
            )
          })
          .slice(0, 9)
          .filter((item) => item.geodesByEnd >= items[0].geodesByEnd)
      })
      .flat()

    pool = pruned
  }

  const best = completed.sort(
    (a, b) => b.resources.geode - a.resources.geode
  )[0]

  return best.resources.geode
}

const timeStart = Date.now()
let total = 1
for (const blueprint of recipes.slice(0, 3)) {
  total *= play(blueprint)
}
console.log(Date.now() - timeStart)
console.log(total)
