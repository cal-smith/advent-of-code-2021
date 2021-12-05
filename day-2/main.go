package main

import (
	"advent-of-code/helpers"
	"fmt"
	"strconv"
	"strings"
)

func part_1() {
	scanner, file := helpers.ScanFile("input.txt")
	defer file.Close()

	x := 0
	y := 0
	for scanner.Scan() {
		command_and_value := strings.Split(scanner.Text(), " ")
		command := command_and_value[0]
		value_str := command_and_value[1]
		value, err := strconv.Atoi(value_str)
		switch command {
		case "up":
			y -= value
		case "down":
			y += value
		case "forward":
			x += value
		}
		helpers.Check(err)
	}
	helpers.Check(scanner.Err())
	fmt.Println("part 1:", x*y)
}

func part_2() {
	scanner, file := helpers.ScanFile("input.txt")
	defer file.Close()

	x := 0
	y := 0
	aim := 0
	for scanner.Scan() {
		command_and_value := strings.Split(scanner.Text(), " ")
		command := command_and_value[0]
		value_str := command_and_value[1]
		value, err := strconv.Atoi(value_str)
		switch command {
		case "up":
			aim -= value
		case "down":
			aim += value
		case "forward":
			x += value
			y += aim * value
		}
		helpers.Check(err)
	}
	helpers.Check(scanner.Err())
	fmt.Println("part 2:", x*y)
}

func main() {
	part_1()
	part_2()
}
