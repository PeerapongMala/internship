package constant

import "time"

type Bug struct {
	BugID       int       `json:"id" db:"id"`
	Platform    string    `json:"platform" db:"platform"`
	Type        string    `json:"type" db:"type"`
	Version     string    `json:"version" db:"version"`
	Priority    string    `json:"priority" db:"priority"`
	Description string    `json:"description" db:"description"`
	Browser     *string   `json:"browser" db:"browser"`
	Os          *string   `json:"os" db:"os"`
	Url         *string   `json:"url" db:"url"`
	Status      string    `json:"status" db:"status"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	CreatedBy   string    `json:"created_by" db:"created_by"`
	CreatorId   string    `json:"creator_id" db:"creator_id"`
	Role        string    `json:"role" db:"role"`
	Images      []string  `json:"images"`
}

type BugFilter struct {
	BugID      int    `json:"id" params:"id"`
	Platform   string `json:"platform" query:"platform"`
	Type       string `json:"type" query:"type"`
	Priority   string `json:"priority" query:"priority"`
	StartDate  string `json:"start_date" query:"start_date"`
	EndDate    string `json:"end_date" query:"end_date"`
	Status     string `json:"status" query:"status"`
	SearchText string `query:"search_text"`
}

type BugLog struct {
	LogID     int       `json:"id" db:"id"`
	BugID     int       `json:"bug_id" db:"bug_id"`
	Status    string    `json:"status" db:"status"`
	Message   *string   `json:"message" db:"message"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	CreatedBy string    `json:"created_by" db:"created_by"`
}
