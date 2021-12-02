package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
)

func check(e error) {
	if e != nil {
		panic(e)
	}
}

func sum(array []int) int {
	s := 0
	for _, v := range array {
		s += v
	}
	return s
}

func main() {
	f, err := os.Open("input.txt")
	check(err)
	defer f.Close()

	scanner := bufio.NewScanner(f)

	prev := 0
	count := 0
	for scanner.Scan() {
		i, err := strconv.Atoi(scanner.Text())
		check(err)
		if i > prev && prev != 0 {
			count++
		}
		prev = i
	}
	check(scanner.Err())
	fmt.Println("part 1:", count)

	f.Seek(0, 0)
	scanner_part_two := bufio.NewScanner(f)
	var window [4]int
	i := 0
	part_two_count := 0
	for scanner_part_two.Scan() {
		number, err := strconv.Atoi(scanner_part_two.Text())
		check(err)
		if i < 3 {
			window[i] = number
			i++
		} else {
			j := 0
			for j < 3 {
				window[j] = window[j+1]
				j++
			}
			window[i] = number
			a_sum := sum(window[:3])
			b_sum := sum(window[1:])
			if b_sum > a_sum {
				part_two_count++
			}
		}
	}
	check(scanner_part_two.Err())
	fmt.Println("part 2:", part_two_count)
}
