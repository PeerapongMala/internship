package models

import "time"

type FAQ struct {
	ID        int       `json:"id"`
	Question  string    `json:"question"`
	Answer    string    `json:"answer"`
	Category  string    `json:"category"`
	Views     int       `json:"views"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type CreateFAQRequest struct {
	Question string `json:"question"`
	Answer   string `json:"answer"`
	Category string `json:"category"`
}

type UpdateFAQRequest struct {
	Question string `json:"question"`
	Answer   string `json:"answer"`
	Category string `json:"category"`
}
