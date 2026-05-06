package constant

import "time"

type TosAcceptanceEntity struct {
	UserId     string
	TosId      int
	AcceptedAt *time.Time
}

type TosEntity struct {
	Version   *string    `json:"version" db:"version"`
	Content   *string    `json:"content" db:"content"`
	CreatedAt *time.Time `json:"created_at" db:"created_at"`
	UpdatedAt *time.Time `json:"updated_at" db:"updated_at"`
}
