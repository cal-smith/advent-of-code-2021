use std::{thread, time, vec::*, iter::*, fs::File, io::stdout, io::prelude::*, convert::TryInto};
use crossterm::{QueueableCommand, ExecutableCommand, queue};
use crossterm::cursor::{MoveUp, MoveDown, Hide, Show};
use crossterm::style::{Print, SetAttribute, Attribute};

type Octopi = Vec<Vec<i32>>;
#[derive(Debug)]
struct LoopInfo {
    i: usize,
    j: usize,
    height: usize,
    width: usize
}

fn loop_octopi(lines: &mut Octopi, mut func: impl FnMut(&mut Octopi, LoopInfo)) {
    let outer_len = lines.len();
    let inner_len = lines[0].len();
    for i in 0..lines.len() {
        for j in 0..lines[i].len() {
            let info = LoopInfo {
                i,
                j,
                height: outer_len - 1,
                width: inner_len - 1
            };
            func(lines, info);
        }
    }
}

fn set_cell(lines: &mut Octopi, i: usize, j: usize, value: i32) {
    if i < lines.len() && j < lines[i].len() {
        lines[i][j] = value;
    }
}

fn increment_cell(lines: &mut Octopi, i: usize, j: usize) {
    if i < lines.len() && j < lines[i].len() {
        if lines[i][j] != -1 {
            lines[i][j] += 1;
        }
    }
}

fn increment_and_flash(lines: &mut Octopi, i: usize, j: usize) {
    increment_cell(lines, i, j);
    if i < lines.len() && j < lines[i].len() {
        flash_octopus(lines, i, j);
    }
}

fn flash_octopus(lines: &mut Octopi, i: usize, j: usize) {
    let cell = lines[i][j];
    if cell > 9 {
        set_cell(lines, i, j, -1);
        // down
        increment_and_flash(lines, i + 1, j);
        // down + right
        increment_and_flash(lines, i + 1, j + 1);
        // right
        increment_and_flash(lines, i, j + 1);
        if i > 0  {
            // up
            increment_and_flash(lines, i - 1, j);
            // up + right
            increment_and_flash(lines, i - 1, j + 1);
            if j > 0 {
                // up + left
                increment_and_flash(lines, i - 1, j - 1);
            }
        }

        if j > 0 {
            // left
            increment_and_flash(lines, i, j - 1);
            // down + left
            increment_and_flash(lines, i + 1, j - 1);
        }
    }
}

fn step_octopi(lines: &mut Octopi) -> i32 {
    let mut flashes = 0;
    // increment each octopus by 1
    loop_octopi(lines, |lines, info| {
        increment_cell(lines, info.i, info.j);
    });
    // flash octopus (set to -1) and increment neighbouring octopus by 1
    loop_octopi(lines, |lines, info| {
        flash_octopus(lines, info.i, info.j);
    });
    // set flashed (-1) octopi to 0
    // if there's any un-flashed octopi, set them to 0 as well
    loop_octopi(lines, |lines, info| {
        let cell = lines[info.i][info.j];
        if cell == -1 || cell > 9 {
            set_cell(lines, info.i, info.j, 0);
            flashes += 1;
        }
    });
    flashes
}

fn pretty_print_step(mut output: &std::io::Stdout, lines: &mut Octopi) {
    // print state
    let len: u16 = lines.len().try_into().unwrap();
    for line in lines {
        for octopus in line {
            if *octopus == 0 {
                queue!(
                    output,
                    SetAttribute(Attribute::Bold),
                    Print(octopus.to_string()),
                    SetAttribute(Attribute::Reset)
                ).unwrap();
            } else {
                output.queue(Print(octopus.to_string())).unwrap();
            }
        }
        output.queue(Print("\n")).unwrap();
    }
    output.queue(MoveUp(len)).unwrap();
    output.flush().unwrap();
    thread::sleep(time::Duration::from_millis(200));
}

fn count_flashes(lines: &mut Octopi, steps: i32) -> i32 {
    let mut flash_count = 0;
    let mut output = stdout();
    output.queue(Hide).unwrap();
    let len: u16 = lines.len().try_into().unwrap();
    for _ in 0..steps {
        flash_count += step_octopi(lines);
        pretty_print_step(&output, lines);
    }
    output.execute(Show).unwrap();
    output.execute(MoveDown(len)).unwrap();
    flash_count
}

fn find_sync_step(lines: &mut Octopi) -> i32 {
    let mut step = 0;
    let mut output = stdout();
    output.queue(Hide).unwrap();
    let height: u16 = lines.len().try_into().unwrap();
    let width: u16 = lines[0].len().try_into().unwrap();
    loop {
        step += 1;
        let flash_count = step_octopi(lines);
        pretty_print_step(&output, lines);
        if flash_count == (height * width).into() {
            break;
        }
    }
    output.execute(Show).unwrap();
    output.execute(MoveDown(height)).unwrap();
    step
}

fn parse(input: &str) -> Octopi {
    input.trim().split("\n").map(|line| {
        line.split("").filter(|string| *string != "").map(|number| {
            number.parse::<i32>().unwrap()
        }).collect()
    }).collect()
}

fn main() -> std::io::Result<()> {
    let example = "5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526
";

    let mut file = File::open("input.txt")?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;

    let example_flash_count = count_flashes(&mut parse(example), 100);
    println!("example part 1: {}", example_flash_count);
    let flash_count = count_flashes(&mut parse(&contents), 100);
    println!("part 1: {}", flash_count);
    let example_sync_step = find_sync_step(&mut parse(example));
    println!("example part 2: {}", example_sync_step);
    let sync_step = find_sync_step(&mut parse(&contents));
    print!("part 2: {}", sync_step);

    Ok(())
}