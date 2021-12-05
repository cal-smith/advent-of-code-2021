package main

import (
	"advent-of-code/helpers"
	"bufio"
	"fmt"
	"strconv"
	"strings"
)

func get_bits(scanner *bufio.Scanner) [][]int {
	all_bits := make([][]int, 0)
	for scanner.Scan() {
		bits_str := strings.Split(scanner.Text(), "")
		bits := make([]int, 0)
		for _, v := range bits_str {
			iv, err := strconv.Atoi(v)
			helpers.Check(err)
			bits = append(bits, iv)
		}
		all_bits = append(all_bits, bits)
	}
	return all_bits
}

func part_1() {
	scanner, file := helpers.ScanFile("input.txt")
	defer file.Close()

	all_bits := get_bits(scanner)

	var one_count [12]int
	var zero_count [12]int
	for _, bits := range all_bits {
		for i, bit := range bits {
			if bit == 0 {
				zero_count[i]++
			} else {
				one_count[i]++
			}
		}
	}

	most_common_str := ""
	least_common_str := ""
	for i := range one_count {
		if one_count[i] > zero_count[i] {
			most_common_str += "1"
			least_common_str += "0"
		} else {
			most_common_str += "0"
			least_common_str += "1"
		}
	}

	gamma, err := strconv.ParseInt(most_common_str, 2, 64)
	helpers.Check(err)
	epsilon, err := strconv.ParseInt(least_common_str, 2, 64)
	helpers.Check(err)

	helpers.Check(scanner.Err())
	fmt.Println("part 1:", gamma*epsilon)
}

func part_2() {
	scanner, file := helpers.ScanFile("input.txt")
	defer file.Close()

	all_bits := get_bits(scanner)

	oxygen_bits := all_bits
	for i := 0; i < len(all_bits[0]); i++ {
		if len(oxygen_bits) == 1 {
			break
		}
		one_count := 0
		zero_count := 0
		for _, bits := range oxygen_bits {
			if bits[i] == 0 {
				zero_count++
			} else {
				one_count++
			}
		}

		filter := make([][]int, 0)
		for _, bits := range oxygen_bits {
			if one_count > zero_count && bits[i] == 1 {
				filter = append(filter, bits)
			} else if zero_count > one_count && bits[i] == 0 {
				filter = append(filter, bits)
			} else if one_count == zero_count && bits[i] == 1 {
				filter = append(filter, bits)
			}
		}
		oxygen_bits = filter
	}

	co2_bits := all_bits
	for i := 0; i < len(all_bits[0]); i++ {
		if len(co2_bits) == 1 {
			break
		}
		one_count := 0
		zero_count := 0
		for _, bits := range co2_bits {
			if bits[i] == 0 {
				zero_count++
			} else {
				one_count++
			}
		}

		filter := make([][]int, 0)
		for _, bits := range co2_bits {
			if one_count < zero_count && bits[i] == 1 {
				filter = append(filter, bits)
			} else if zero_count < one_count && bits[i] == 0 {
				filter = append(filter, bits)
			} else if one_count == zero_count && bits[i] == 0 {
				filter = append(filter, bits)
			}
		}
		co2_bits = filter
	}

	oxygen_str := ""
	co2_str := ""
	for i := range oxygen_bits[0] {
		oxygen_str += strconv.Itoa(oxygen_bits[0][i])
		co2_str += strconv.Itoa(co2_bits[0][i])
	}
	oxygen, err := strconv.ParseInt(oxygen_str, 2, 64)
	helpers.Check(err)
	co2, err := strconv.ParseInt(co2_str, 2, 64)
	helpers.Check(err)

	helpers.Check(scanner.Err())
	fmt.Println("part 2:", oxygen*co2)
}

func main() {
	part_1()
	part_2()
}
