package models

import "time"

type ChatQuestion struct {
	ID           int       `json:"id"`
	Question     string    `json:"question"`
	CustomerName string    `json:"customer_name"`
	Channel      string    `json:"channel"`
	Frequency    int       `json:"frequency"`
	CreatedAt    time.Time `json:"created_at"`
}

type CreateChatQuestionRequest struct {
	Question     string `json:"question"`
	CustomerName string `json:"customer_name"`
	Channel      string `json:"channel"`
}

type BulkDeleteRequest struct {
	IDs []int `json:"ids"`
}
