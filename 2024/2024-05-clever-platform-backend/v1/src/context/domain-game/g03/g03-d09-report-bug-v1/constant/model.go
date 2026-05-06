package constant

import "time"

type Bug struct {
	BugID       int       `json:"bug_id" db:"id"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	Type        string    `json:"type" db:"type"`
	Description string    `json:"description" db:"description"`
	CreatedBy   string    `json:"created_by" db:"created_by"`
	Status      string    `json:"status" db:"status"`
}
