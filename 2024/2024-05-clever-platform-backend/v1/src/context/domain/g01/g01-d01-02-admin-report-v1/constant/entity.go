package constant

import "time"

type AdminReport struct {
	AverageProgress *float64         `json:"average_progress" db:"average_progress"`
	StartDate       *time.Time       `json:"start_date" db:"start_date"`
	EndDate         *time.Time       `json:"end_date" db:"end_date"`
	ProgressReports []ProgressReport `json:"progress_reports"`
}

type ProgressReport struct {
	Scope      string  `json:"scope"`
	Progress   float64 `json:"progress"`
	TotalCount int     `json:"-" db:"total_count"`
}
