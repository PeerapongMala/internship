package helper

import "math"

func Round(f float64) float64 {
	return math.Trunc(f*100) / 100
}

func FloatsEqual(a, b, tolerance float64) bool {
	return math.Abs(a-b) <= tolerance
}
