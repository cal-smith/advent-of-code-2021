package helpers

import (
	"bufio"
	"os"
)

func Check(e error) {
	if e != nil {
		panic(e)
	}
}

func Sum(array []int) int {
	s := 0
	for _, v := range array {
		s += v
	}
	return s
}

func ScanFile(filename string) (*bufio.Scanner, *os.File) {
	f, err := os.Open(filename)
	Check(err)

	return bufio.NewScanner(f), f
}
