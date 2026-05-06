package helper

import (
	"bytes"
	"encoding/csv"
	"errors"
	"fmt"
	"mime/multipart"
	"strconv"
	"strings"
	"time"
)

func ReadCSV(file *multipart.File, callback func(record []string) error, separator *rune, skip int) error {

	reader := csv.NewReader(*file)
	if separator != nil {
		reader.Comma = *separator
	}

	records, err := reader.ReadAll()

	// Checks for the error
	if err != nil {
		return err
	}

	// and print each of the string slice
	for row, record := range records {
		if row < skip {
			continue
		}

		err = callback(record)
		if err != nil {
			return err
		}
	}
	return nil
}

func ReadHeaderCSV(file *multipart.File, separator *rune) ([]string, error) {
	reader := csv.NewReader(*file)
	if separator != nil {
		reader.Comma = *separator
	}

	record, err := reader.Read()
	if err != nil {
		return nil, err
	}

	return record, nil
}

func WriteCSV(input [][]string, separator *rune) ([]byte, error) {

	var fileBuffer bytes.Buffer
	w := csv.NewWriter(&fileBuffer)
	if separator != nil {
		w.Comma = *separator
	}
	defer w.Flush()

	err := w.WriteAll(input) // calls Flush internally
	if err != nil {
		return nil, err
	}

	return fileBuffer.Bytes(), nil
}

func HandleStringPointerField(value *string) string {
	if value == nil {
		return ""
	}
	return *value
}

func HandleStringToPointer(value string) *string {
	if value == "" {
		return nil
	}
	return &value
}

func HandleTimePointerToField(t *time.Time) string {
	if t == nil {
		none := "-"
		return none
	}

	location, err := time.LoadLocation("Asia/Bangkok")
	if err != nil {
		fmt.Println("Error loading location:", err)
		return "-"
	}

	bangkokTime := t.In(location)
	formattedTime := bangkokTime.Format("2006-01-02 15:04")
	return formattedTime
}

func HandleIntPointerField(value *int) string {
	if value == nil {
		return ""
	}
	return strconv.Itoa(*value)
}

func HandleIntDefaultPointerField(value *int) string {
	if value == nil {
		return "0"
	}
	return strconv.Itoa(*value)
}

func HandleFloatPointerField(value *float64) string {
	if value == nil {
		return "0"
	}
	return strconv.FormatFloat(*value, 'f', 2, 64)
}

func HandleBooleanPointerField(value *bool) string {
	if value == nil {
		return ""
	}
	return fmt.Sprintf("%t", *value)
}

func ReadCSVFileWithValidateHeaders(file *multipart.File, callback func(record []string) error, separator *rune, headers []string) error {
	reader := csv.NewReader(*file)
	if separator != nil {
		reader.Comma = *separator
	}

	headersCsv, err := reader.Read()
	if err != nil {
		return err
	}

	if !validateHeader(headersCsv, headers) {
		return errors.New("CSVFile Header is incorrect")
	}

	records, err := reader.ReadAll()

	// Checks for the error
	if err != nil {
		return err
	}

	// and print each of the string slice
	for _, record := range records {
		err = callback(record)
		if err != nil {
			return err
		}
	}
	return nil
}

func validateHeader(records []string, headers []string) bool {
	if len(records) != len(headers) {
		return false
	}
	for i := range records {
		trimmedRecord := strings.TrimPrefix(records[i], "\uFEFF")
		if trimmedRecord != headers[i] {
			return false
		}
	}
	return true
}

func NewCSVAllRow(csvFile *multipart.FileHeader) ([][]string, error) {
	file, err := csvFile.Open()
	if err != nil {
		return nil, fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	buf := new(bytes.Buffer)
	_, err = buf.ReadFrom(file)
	if err != nil {
		return nil, fmt.Errorf("failed to read file content: %w", err)
	}

	content := removeBOM(buf.Bytes())

	rows, err := csv.NewReader(bytes.NewReader(content)).ReadAll()
	if err != nil {
		return nil, fmt.Errorf("failed to parse file content: %w", err)
	}
	return rows, nil
}

// removeBOM removes the UTF-8 Byte Order Mark (BOM)
func removeBOM(data []byte) []byte {
	bom := []byte{0xEF, 0xBB, 0xBF} // UTF-8 BOM
	if bytes.HasPrefix(data, bom) {
		return data[len(bom):]
	}
	return data
}

func FilterRow(row []string, indices []int) []string {
	if len(indices) == 0 {
		return row
	}
	filtered := make([]string, 0, len(row))
	for _, index := range indices {
		if index < len(row) {
			filtered = append(filtered, row[index])
		}
	}
	return filtered
}
