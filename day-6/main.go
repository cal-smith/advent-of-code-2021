package main

import (
	"advent-of-code/helpers"
	"fmt"
	"strconv"
	"strings"
	"sync"
)

func go_fish(start_fish int, days int) int {
	fishes := make([][]int, 0)
	fish := make([]int, 0)
	fish = append(fish, start_fish)
	fish = append(fish, 1)
	fishes = append(fishes, fish)
	for day := 0; day < days; day++ {
		new_fish_count := 0
		for i := 0; i < len(fishes); i++ {
			if fishes[i][0] == 0 {
				fishes[i][0] = 6
				new_fish_count += fishes[i][1]
			} else {
				fishes[i][0]--
			}
		}
		if new_fish_count > 0 {
			new_fish := make([]int, 0)
			new_fish = append(new_fish, 8)
			new_fish = append(new_fish, new_fish_count)
			fishes = append(fishes, new_fish)
		}
	}

	count := 0
	for _, fish := range fishes {
		count += fish[1]
	}

	return count
}

func count_fishes(days int) int {
	scanner, file := helpers.ScanFile("input.txt")
	defer file.Close()

	fishes := make([]int, 0)
	for scanner.Scan() {
		str_values := strings.Split(scanner.Text(), ",")
		for _, v := range str_values {
			value, err := strconv.Atoi(v)
			helpers.Check(err)
			fishes = append(fishes, value)
		}
	}

	wg := &sync.WaitGroup{}
	fish_count := make(chan int)

	for _, fish := range fishes {
		wg.Add(1)

		go func(fish int) {
			defer wg.Done()
			count := go_fish(fish, days)
			fish_count <- count
		}(fish)
	}

	go func() {
		wg.Wait()
		close(fish_count)
	}()

	count := 0
	for v := range fish_count {
		count += v
	}
	return count
}

func main() {
	fmt.Println("part 1:", count_fishes(80))
	fmt.Println("part 2:", count_fishes(256))
}
