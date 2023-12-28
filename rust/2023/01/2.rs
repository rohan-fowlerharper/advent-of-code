use std::fs;
use std::path::Path;

fn main() {
    let path = Path::new(file!()).parent().unwrap().join("./input.txt");
    let mut input = fs::read_to_string(path).unwrap();

    let replacements = vec![
        ("one", "o1e"),
        ("two", "t2o"),
        ("three", "t3e"),
        ("four", "f4r"),
        ("five", "f5e"),
        ("six", "s6x"),
        ("seven", "s7n"),
        ("eight", "e8t"),
        ("nine", "n9e"),
    ];

    for (first, second) in replacements {
        input = input.replace(first, second);
    }

    let lines: Vec<&str> = input.trim_end().lines().collect();

    let result: u16 = lines
        .iter()
        .map(|line| {
            let numbers: Vec<char> = line.chars().filter(|c| c.is_numeric()).collect();

            let first = numbers.first().unwrap();
            let last = numbers.last().unwrap();

            return format!("{}{}", first, last).parse::<u16>().unwrap();
        })
        .sum();

    println!("Part 2: {:#?}", result);
}
