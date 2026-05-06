package helper

import (
	"errors"
	"fmt"
	"reflect"
	"strconv"
	"strings"
	"time"
)

func ConvertTimeStringToTime(timeString string) (*time.Time, error) {
	var layouts = []string{
		time.DateOnly,
		time.DateTime,
		time.RFC3339,
		"2006-01-02 15:04",
	}

	for _, layout := range layouts {
		t, err := time.Parse(layout, timeString)
		if err == nil {
			return &t, nil
		}
	}

	err := errors.New("time is not in any of the supported layouts")
	return nil, err
}

func ConvertTimeToStringTime(t *time.Time) string {
	return t.Format(time.RFC3339)
}

func FilterStructWithDate[T interface{}](startDate time.Time, endDate time.Time, input T, filterField string) (T, error) {
	filtered := reflect.MakeSlice(reflect.TypeOf(input), 0, 0)
	inputValue := reflect.ValueOf(input)

	startDate = time.Date(startDate.Year(), startDate.Month(), startDate.Day(), 0, 0, 0, 0, startDate.Location())
	endDate = time.Date(endDate.Year(), endDate.Month(), endDate.Day(), 0, 0, 0, 0, endDate.Location())

	for i := 0; i < inputValue.Len(); i++ {
		item := inputValue.Index(i)
		dateField := item.FieldByName(filterField)
		if !dateField.IsValid() {
			return input, errors.New("field 'Date' not found in input")
		}

		// If the field is a pointer, we need to dereference it
		if dateField.Kind() == reflect.Ptr {
			dateField = dateField.Elem()
		}

		var date *time.Time
		var err error
		switch dateField.Kind() {
		case reflect.Struct:
			if dateField.Type() == reflect.TypeOf(time.Time{}) {
				t := dateField.Interface().(time.Time)
				date = &t
			} else if dateField.Type() == reflect.TypeOf(&time.Time{}) {
				t := dateField.Interface().(*time.Time)
				date = t
			}
		case reflect.String:
			dateString := dateField.String()
			date, err = ConvertTimeStringToTime(dateString)
			if err != nil {
				return input, err
			}
		}

		dateCheck := time.Date(date.Year(), date.Month(), date.Day(), 0, 0, 0, 0, date.Location())
		if (dateCheck.After(startDate) && dateCheck.Before(endDate)) || dateCheck.Equal(startDate) || dateCheck.Equal(endDate) {
			filtered = reflect.Append(filtered, item)
		}
	}
	return filtered.Interface().(T), nil
}

func ThaiDateToTime(thaiDate string) (time.Time, error) {
	parts := strings.Split(thaiDate, "/")
	if len(parts) != 3 {
		return time.Time{}, fmt.Errorf("invalid date format")
	}

	month, _ := strconv.Atoi(parts[0])
	day, _ := strconv.Atoi(parts[1])
	year, _ := strconv.Atoi(parts[2])
	gregorianYear := year - 543

	return time.Date(gregorianYear, time.Month(month), day, 0, 0, 0, 0, time.UTC), nil
}

func CalculateAge(birthDate time.Time) (years int, months int) {
	now := time.Now()

	years = now.Year() - birthDate.Year()
	months = int(now.Month()) - int(birthDate.Month())

	if months < 0 {
		years--
		months += 12
	}

	if now.Day() < birthDate.Day() {
		months--
		if months < 0 {
			years--
			months = 11
		}
	}

	return years, months
}
