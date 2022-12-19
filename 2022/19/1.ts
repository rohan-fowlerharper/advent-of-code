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
    time: 24,
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

  let maxGeodesSeen = 0
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
          item.bots[recipeName as Resource] >= maxes[recipeName as Resource]
        )
          continue

        const newBots = { ...item.bots } as Item['bots']
        const newResources = { ...item.resources } as Item['resources']

        for (const [resource, required] of Object.entries(recipe)) {
          newResources[resource as Resource] -= required
        }
        newBots[recipeName as Resource] += 1

        for (const [robot, n] of Object.entries(item.bots)) {
          newResources[robot as Resource] += n
        }

        roundItems.push({
          time: item.time - 1,
          timePassed: item.timePassed + 1,
          resources: newResources,
          bots: newBots,
          geodesByEnd: newResources.geode + newBots.geode * (item.time - 1),
        })

        // be greedy with geodes and obsidian
        if (recipeName === 'geode' || recipeName === 'obsidian') {
          continue recipes
        }
      }

      const newResources = { ...item.resources }

      for (const [robot, n] of Object.entries(item.bots)) {
        newResources[robot as Resource] += n
      }

      roundItems.push({
        time: item.time - 1,
        timePassed: item.timePassed + 1,
        resources: newResources,
        bots: item.bots,
        geodesByEnd: newResources.geode + item.bots.geode * (item.time - 1),
      })
    }

    const pruned = roundItems
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
      .slice(0, 22)
      .filter(
        (t, _, array) =>
          t.geodesByEnd >= array[0].geodesByEnd ||
          t.geodesByEnd <= maxGeodesSeen
      )

    maxGeodesSeen = Math.max(pruned[0]?.geodesByEnd ?? 0, maxGeodesSeen)
    pool = pruned
  }

  const best = completed.sort(
    (a, b) => b.resources.geode - a.resources.geode
  )[0]

  return best.resources.geode * blueprint.n
}

let total = 0
for (const blueprint of recipes) {
  total += play(blueprint)
}
console.log(total)
