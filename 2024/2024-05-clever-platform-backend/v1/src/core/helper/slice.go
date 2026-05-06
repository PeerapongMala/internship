package helper

import (
	"fmt"
	"strings"

	"github.com/jackc/pgx/pgtype"
	"github.com/lib/pq"
)

func RemoveDuplicate[T comparable](sliceList []T) []T {
	allKeys := make(map[T]bool)
	list := []T{}
	for _, item := range sliceList {
		if _, value := allKeys[item]; !value {
			allKeys[item] = true
			list = append(list, item)
		}
	}
	return list
}

func EnsureNotNil[T comparable](sliceList []T) []T {
	if sliceList == nil {
		return []T{}
	}
	return sliceList
}

func ConvertPgtypeInt4ToInt(arr pgtype.Int4Array) []int {
	result := []int{}
	for _, v := range arr.Elements {
		if v.Int == 0 {
			//skip when value is 0
			continue
		}
		result = append(result, int(v.Int))
	}
	return result
}

func ConvertPgInt64ToInt(arr pq.Int64Array) []int {
	result := []int{}
	for _, v := range arr {
		if v == 0 {
			//skip when value is 0
			continue
		}
		result = append(result, int(v))
	}
	return result
}

// []int{1, 2, 3} => "1,2,3"
func ConvertIntSlicesToIntStringWithCommas(arr []int) string {
	return strings.Trim(strings.Join(strings.Fields(fmt.Sprint(arr)), ","), "[]")
}
