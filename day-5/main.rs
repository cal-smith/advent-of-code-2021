use std::fs::File;
use std::iter::*;
use std::vec::*;
use std::io::prelude::*;
use std::collections::HashMap;

#[derive(Debug, Copy, Clone)]
struct Point {
    x: i32,
    y: i32
}

#[derive(Debug)]
struct Line {
    start: Point,
    end: Point
}

fn is_horizontal(line: &Line) -> bool {
    line.start.y == line.end.y
}

fn is_vertical(line: &Line) -> bool {
    line.start.x == line.end.x
}

fn get_vertical_points(line: &Line) -> Vec<Point> {
    let mut points = vec![];
    let mut start = &line.start;
    let mut end = &line.end;
    if start.y > end.y {
        let tmp = start;
        start = end;
        end = tmp;
    }

    let x_value = start.x;
    for i in start.y..end.y + 1 {
        let point = Point { x: x_value, y: i };
        points.push(point);
    }

    points
}

fn get_horizontal_points(line: &Line) -> Vec<Point> {
    let mut points = vec![];
    let mut start = &line.start;
    let mut end = &line.end;
    if start.x > end.x {
        let tmp = start;
        start = end;
        end = tmp;
    }

    let y_value = start.y;
    for i in start.x..end.x + 1 {
        let point = Point { x: i, y: y_value };
        points.push(point);
    }

    points
}

fn get_angle_points(line: &Line) -> Vec<Point> {
    let mut points = vec![];
    let mut start = &line.start;
    let mut end = &line.end;
    if start.x > end.x {
        let tmp = start;
        start = end;
        end = tmp;
    }

    let mut j = start.y;
    for i in start.x..end.x + 1 {
        let point = Point { x: i, y: j };
        points.push(point);
        if start.y < end.y {
            j += 1;
        } else {
            j -= 1;
        }
    }

    points
}

fn find_intersections(lines: &Vec<Line>, line_to_points: fn(&Line) -> Vec<Point>) -> HashMap<String, i32> {
    let mut intersections = HashMap::new();
    for line in lines {
        let points: Vec<Point> = line_to_points(line);
        for point in points {
            let key = format!("{},{}", point.x, point.y);
            if let Some(x) = intersections.get_mut(&key) {
                *x += 1;
            } else {
                intersections.insert(key, 1);
            }
        }
    }

    intersections
}

fn count_intersections(intersections: HashMap<String, i32>) -> i32 {
    let mut count = 0;
    for (_key, val) in intersections.iter() {
        if *val > 1 {
            count += 1;
        }
    }
    count
}

fn main() -> std::io::Result<()> {
    let mut file = File::open("input.txt")?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;

    let lines: Vec<Line> = contents.split("\n").map(|line| {
        let line_parts: Vec<Point> = line.split(" -> ").map(|part| {
            let values: Vec<i32> = part.split(",").map(|number| {
                number.parse::<i32>().unwrap()
            }).collect();
            Point { x: values[0], y: values[1] }
        }).collect();
        Line { start: line_parts[0], end: line_parts[1] }
    }).collect();

    let straight_intersections = find_intersections(&lines, |line| {
        if is_horizontal(&line) {
            get_horizontal_points(&line)
        } else if is_vertical(&line) {
            get_vertical_points(&line)
        } else {
            vec![]
        }
    });

    let all_intersections = find_intersections(&lines, |line| {
        if is_horizontal(&line) {
            get_horizontal_points(&line)
        } else if is_vertical(&line) {
            get_vertical_points(&line)
        } else {
            get_angle_points(&line)
        }
    });

    println!("part 1: {}", count_intersections(straight_intersections));
    println!("part 2: {}", count_intersections(all_intersections));
    Ok(())
}