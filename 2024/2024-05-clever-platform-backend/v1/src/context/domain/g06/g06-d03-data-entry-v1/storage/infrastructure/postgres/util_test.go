package postgres

import (
	"reflect"
	"testing"
)

func TestConvertStringListToIntList(t *testing.T) {
	tests := []struct {
		input    string
		expected []int
	}{
		{"[1,2,3]", []int{1, 2, 3}},
		{"[ 1,  2,3 ]", []int{1, 2, 3}},
		{"[]", []int{}},
		{"[  ]", nil},
		{"[10,20,30, 40]", []int{10, 20, 30, 40}},
		{"[5]", []int{5}},
		{"[  42  ]", []int{42}},
		{"[a,b,c]", nil},
		{"[1, 2, three]", nil},
		{"1,2,3", nil},
		{"[1,2,3]xyz", nil},
	}

	for _, tt := range tests {
		result := convertStringListToIntList(tt.input)
		if !reflect.DeepEqual(result, tt.expected) {
			t.Errorf("convertStringListToIntList(%q) = %v; want %v", tt.input, result, tt.expected)
		}
	}
}
