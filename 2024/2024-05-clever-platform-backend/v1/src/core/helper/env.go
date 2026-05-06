package helper

import (
	"fmt"
	"os"
	"strconv"
)

func GetEnv[T any](key string, defaultValue T) (T, error) {
	var zero T
	valueStr := os.Getenv(key)
	if valueStr == "" {
		return defaultValue, nil
	}

	switch any(zero).(type) {
	case string:
		return any(valueStr).(T), nil
	case int:
		val, err := strconv.Atoi(valueStr)
		return any(val).(T), err
	case float64:
		val, err := strconv.ParseFloat(valueStr, 64)
		return any(val).(T), err
	case bool:
		val, err := strconv.ParseBool(valueStr)
		return any(val).(T), err
	default:
		return zero, fmt.Errorf("unsupported type: %T", zero)
	}
}
