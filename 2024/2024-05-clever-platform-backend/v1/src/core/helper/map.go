package helper

import "reflect"

func CountLeaves(data interface{}) int {
	count := 0
	val := reflect.ValueOf(data)
	if val.Kind() == reflect.Map {
		for _, key := range val.MapKeys() {
			value := val.MapIndex(key)
			count += CountLeaves(value.Interface())
		}
		return count
	}

	if val.Kind() == reflect.Slice || val.Kind() == reflect.Array {
		for i := 0; i < val.Len(); i++ {
			count += CountLeaves(val.Index(i).Interface())
		}
		return count
	}
	return 1
}
