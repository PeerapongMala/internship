package helper

import (
	"fmt"
	"time"
)

type DateFilterBase struct {
	StartDateStr string `query:"start_date"`
	EndDateStr   string `query:"end_date"`
	StartDate    *time.Time
	EndDate      *time.Time
}

func (filter *DateFilterBase) ParseDateTimeFilter(format string) error {
	var err error
	filter.StartDate, err = convertDateStr(filter.StartDateStr, format)
	if err != nil {
		return err
	}
	filter.EndDate, err = convertDateStr(filter.EndDateStr, format)
	if err != nil {
		return err
	}

	// var newEndDate time.Time
	if filter.EndDate != nil {
		newEndDate := filter.EndDate.Add(23*time.Hour + 59*time.Minute + 59*time.Second + 999999*time.Microsecond)
		filter.EndDate = &newEndDate
	}
	return nil
}

func convertDateStr(in string, format string) (*time.Time, error) {
	if len(in) == 0 {
		return nil, nil
	}
	o, err := time.Parse(format, in)
	if err != nil {
		return nil, err
	}
	return &o, nil
}

func FormatThaiDate(t *time.Time, convertToThaiTZ ...bool) string {
	if t == nil {
		return ""
	}

	timeToFormat := *t
	if len(convertToThaiTZ) > 0 && convertToThaiTZ[0] {
		thaiLoc, err := time.LoadLocation("Asia/Bangkok")
		if err == nil {
			timeToFormat = t.In(thaiLoc)
		}
	}

	thaiMonths := []string{"", "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."}
	day := timeToFormat.Day()
	month := thaiMonths[int(timeToFormat.Month())]
	year := timeToFormat.Year() + 543
	hour := timeToFormat.Hour()
	minute := timeToFormat.Minute()

	return fmt.Sprintf("%d %s %d %02d:%02d", day, month, year, hour, minute)
}
