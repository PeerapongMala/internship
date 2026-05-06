package helper

import (
	"fmt"
	"testing"
	"time"
)

type TestStruct1 struct {
	Name      string
	CreatedAt *time.Time
}

type TestStruct2 struct {
	Name      string
	CreatedAt time.Time
}

type TestStruct3 struct {
	Name      string
	CreatedAt string
}

type TestStruct4 struct {
	Name      string
	CreatedAt *string
}

func TestFilterStructWithDate(t *testing.T) {

	test1, test2, test3, test4 := generateMockData()

	var err error
	startDate := time.Date(2022, 1, 1, 0, 0, 0, 0, time.UTC)
	endDate := time.Date(2028, 12, 31, 0, 0, 0, 0, time.UTC)
	
	//expected result is 7
	test1, err = FilterStructWithDate(startDate, endDate, test1, "CreatedAt")
	if err != nil {
		t.Errorf("Error: %v", err)
	}

	//expected result is 7
	test2, err = FilterStructWithDate(startDate, endDate, test2, "CreatedAt")
	if err != nil {
		t.Errorf("Error: %v", err)
	}

	//expected result is 7
	test3, err = FilterStructWithDate(startDate, endDate, test3, "CreatedAt")
	if err != nil {
		t.Errorf("Error: %v", err)
	}

	//expected result is 7
	test4, err = FilterStructWithDate(startDate, endDate, test4, "CreatedAt")
	if err != nil {
		t.Errorf("Error: %v", err)
	}

	if len(test1) != 7 {
		t.Errorf("test1 Expected 7, got %d", len(test1))
	}

	if len(test2) != 7 {
		t.Errorf("test2 Expected 7, got %d", len(test2))
	}

	if len(test3) != 7 {
		t.Errorf("test3 Expected 7, got %d", len(test3))
	}

	if len(test4) != 7 {
		t.Errorf("test4 Expected 7, got %d", len(test4))
	}
}

func generateMockData() ([]TestStruct1, []TestStruct2, []TestStruct3, []TestStruct4) {
	
	var mockStruct1 []TestStruct1
	var mockStruct2 []TestStruct2
	var mockStruct3 []TestStruct3
	var mockStruct4 []TestStruct4
	
	for i := 0; i < 10; i++ {

		createdAt := time.Date(2020, 1, 1, 0, 0, 0, 0, time.UTC).AddDate(i, 0, 0)
		createdAtString := createdAt.Format(time.RFC3339)

		mockStruct1 = append(mockStruct1, TestStruct1{
			Name:      fmt.Sprintf("Name %d", i),
			CreatedAt: &createdAt,
		})
		mockStruct2 = append(mockStruct2, TestStruct2{
			Name:      fmt.Sprintf("Name %d", i),
			CreatedAt: createdAt,
		})
		mockStruct3 = append(mockStruct3, TestStruct3{
			Name:      fmt.Sprintf("Name %d", i),
			CreatedAt: createdAtString,
		})
		mockStruct4 = append(mockStruct4, TestStruct4{
			Name:      fmt.Sprintf("Name %d", i),
			CreatedAt: &createdAtString,
		})
	}

	return mockStruct1, mockStruct2, mockStruct3, mockStruct4
}