package helper

func SafeDivide(dividend, divisor float64) float64 {
	if divisor == 0 {
		return 0
	}
	return dividend / divisor
}
