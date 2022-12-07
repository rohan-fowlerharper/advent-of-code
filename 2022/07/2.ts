import * as p from 'https://deno.land/std@0.165.0/path/mod.ts'

const input = await Deno.readTextFile(
  p.fromFileUrl(import.meta.resolve('./input.txt'))
)

const lines = input.split('\n')

// this one is an oof
type Directory = {
  [key: string]: number | Directory
}

let historyStack = []
const fileTree: Directory = {}

const getCurrentDir = (stack: string[]) => {
  if (stack.length === 0) return null
  let currentDir = fileTree
  for (const dir of stack) {
    currentDir = currentDir[dir] as Directory
  }
  return currentDir
}

for (const line of lines) {
  if (line === '') continue
  if (line.startsWith('$')) {
    const command = line.split(' ')[1]

    if (command === 'cd') {
      if (line.split(' ')[2] === '..') {
        historyStack.pop()
      } else if (line.split(' ')[2] === '/') {
        historyStack = []
      } else {
        historyStack.push(line.split(' ')[2])
      }
    }
  } else {
    if (line.startsWith('dir')) {
      const dirName = line.split(' ')[1]
      const currentDir = getCurrentDir(historyStack)
      if (currentDir) {
        currentDir[dirName] = {}
      } else {
        fileTree[dirName] = {}
      }
    } else {
      const [fileSize, fileName] = line.split(' ')
      const currentDir = getCurrentDir(historyStack)

      if (currentDir) {
        currentDir[fileName] = parseInt(fileSize)
      } else {
        fileTree[fileName] = parseInt(fileSize)
      }
    }
  }
}

const dirSizes: number[] = []
function getDirSize(tree: Directory) {
  let size = 0
  for (const key in tree) {
    if (typeof tree[key] === 'number') {
      size += tree[key] as number
    } else {
      const localSize = getDirSize(tree[key] as Directory) // heckin typescript

      size += localSize
      dirSizes.push(localSize)
    }
  }
  return size
}

getDirSize(fileTree)

const totalSpaceTaken = getDirSize(fileTree)
const totalSpaceAvailable = 70000000
const currentSpace = totalSpaceAvailable - totalSpaceTaken
const requiredSpace = 30000000 - currentSpace

const closestDirSize = dirSizes
  .filter((s) => s >= requiredSpace)
  .sort((a, b) => a - b)[0]

console.log(closestDirSize)
