# [Advent of Code](https://adventofcode.com) solutions in TS using Deno 🦕

## Usage

For 2022:
```sh
# on the day
deno task setup # generates 1.ts, 2.ts, and input.txt in the day's folder
                # with a basic boilerplate

deno task o 1 # to run the first part of the day's puzzle
deno task o 2 # to run the second part
```

For 2021 (_or other days_):
```sh
# deno task setup <year> <day> 

deno task setup 2021 1 # generates 1.ts, 2.ts, and input.txt in ./2021/01/
                       # with a basic boilerplate

# deno task watch <path>
deno task watch 2021/01/1.ts # to run the first part of a day's puzzle
deno task watch 2021/01/2.ts # to run the second part
```
