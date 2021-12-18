use std::{
    io::{
        Result
    },
    iter::*,
    vec::*,
    fs::File,
    io::prelude::*,
    fmt
};

#[derive(Debug, PartialEq)]
enum FoldDirection {
    X,
    Y
}

#[derive(Debug)]
struct Fold {
    direction: FoldDirection,
    location: usize
}
type Point = (usize, usize);

#[derive(Debug)]
struct Paper {
    lines: Vec<Vec<String>>,
    width: usize,
    height: usize
}

impl Paper {
    fn new(points: &Vec<Point>) -> Paper {
        let (width, height) = minmax(&points);
        let mut paper = vec![];
        for _i in 0..height {
            let mut row: Vec<String> = vec![];
            for _j in 0..width {
                row.push(".".to_string());
            }
            paper.push(row);
        }

        for point in points {
            let (x, y) = *point;
            paper[y][x] = "#".to_string();
        }

        Paper {
            lines: paper,
            width,
            height
        }
    }

    fn fold(&mut self, fold: &Fold) {
        if fold.direction == FoldDirection::X {
            for i in 0..self.height {
                for j in (0..fold.location).rev() {
                    let jj = fold.location + (fold.location - j);
                    if jj < self.width {
                        if self.lines[i][jj] == "#" {
                            self.lines[i][j] = "#".to_string();
                        }
                    }
                }
            }
            self.width = fold.location;
        } else {
            for i in (0..fold.location).rev() {
                let ii = fold.location + (fold.location - i);
                if ii < self.height {
                    for j in 0..self.width {
                        if self.lines[ii][j] == "#" {
                            self.lines[i][j] = "#".to_string();
                        }
                    }
                }
            }
            self.height = fold.location;
        }
    }

    fn count_visible(&self) -> i32 {
        let mut count = 0;
        for i in 0..self.height {
            for j in 0..self.width {
                if self.lines[i][j] == "#" {
                    count += 1;
                }
            }
        }
        count
    }
}

impl fmt::Display for Paper {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let mut lines = String::new();
        for i in 0..self.height {
            let mut line_builder = String::new();
            for j in 0..self.width {
                line_builder.push_str(&self.lines[i][j]);
            }
            lines.push_str(&line_builder);
            lines.push_str("\n");
        } 
        write!(f, "{}", lines)
    }
}

fn parse(input: &str) -> (Vec<Point>, Vec<Fold>) {
    let parts: Vec<&str> = input.trim().split("\n\n").collect();
    let points: Vec<Point> = parts[0].split("\n").map(|line| {
        let points: Vec<&str> = line.split(",").collect();
        (
            points[0].parse::<usize>().unwrap(),
            points[1].parse::<usize>().unwrap()
        )
    }).collect();
    let folds: Vec<Fold> = parts[1].split("\n").map(|line| {
        let parts: Vec<&str> = line.split("=").collect();
        Fold {
            direction: if parts[0].ends_with("y") { FoldDirection::Y } else { FoldDirection::X },
            location: parts[1].parse::<usize>().unwrap()
        }
    }).collect();
    (points, folds)
}

fn minmax(points: &Vec<Point>) -> (usize, usize) {
    let mut max_x = 0;
    let mut max_y = 0;
    for point in points {
        let (x, y) = *point;
        if x > max_x {
            max_x = x;
        }
        if y > max_y {
            max_y = y;
        }
    }
    (max_x + 1, max_y + 1)
}

fn main() -> Result<()> {
    let example = "6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5
";
    let mut file = File::open("input.txt")?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;

    let (example_points, example_folds) = parse(example);
    let mut example_paper = Paper::new(&example_points);
    example_paper.fold(&example_folds[0]);

    let (points, folds) = parse(&contents);
    let mut part1 = Paper::new(&points);
    part1.fold(&folds[0]);

    println!("part 1 example: {}", example_paper.count_visible());
    println!("part 1: {}", part1.count_visible());

    example_paper.fold(&example_folds[1]);
    println!("part 2 example: \n{}", example_paper);

    let mut part2 = Paper::new(&points);
    for fold in folds {
        part2.fold(&fold);
    }
    println!("part 2: \n{}", part2);
    Ok(())
}