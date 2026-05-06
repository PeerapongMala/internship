package postgres

import (
	"strconv"
	"strings"
)

func convertStringListToIntList(s string) []int {
	// Remove surrounding brackets
	s = strings.TrimSpace(s)
	if len(s) < 2 || s[0] != '[' || s[len(s)-1] != ']' {
		return nil // Return nil if the input is not properly formatted
	}
	s = strings.Trim(s, "[]")

	// If the list is empty, return an empty slice
	if len(s) == 0 {
		return []int{}
	}

	// Split the string by commas and trim spaces
	parts := strings.Split(s, ",")
	var result []int

	for _, part := range parts {
		part = strings.TrimSpace(part) // Remove extra spaces
		if num, err := strconv.Atoi(part); err == nil {
			result = append(result, num)
		} else {
			return nil // Return nil if there's a non-integer value
		}
	}

	return result
}
