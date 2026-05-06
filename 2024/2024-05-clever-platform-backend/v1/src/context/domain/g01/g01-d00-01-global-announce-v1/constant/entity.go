package constant

import (
	"time"
)

type AnnounceResponse struct {
	Id          int       `json:"id" db:"id"`
	SchoolId    int       `json:"school_id" db:"school_id"`
	Scope       string    `json:"scope" db:"scope"`
	Type        string    `json:"type" db:"type"`
	StartAt     string    `json:"started_at" db:"started_at"`
	EndAt       string    `json:"ended_at" db:"ended_at"`
	Title       string    `json:"title" db:"title"`
	Description string    `json:"description" db:"description"`
	Image       string    `json:"image_url" db:"image_url"`
	Status      string    `json:"status" db:"status"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	CreatedBy   string    `json:"created_by" db:"created_by"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy   string    `json:"updated_by" db:"updated_by"`
}
type CreateAnnounceRequest struct {
	SchoolId    int       `json:"school_id" db:"school_id"`
	Scope       string    `json:"scope" db:"scope"`
	Type        string    `json:"type" db:"type"`
	StartAt     time.Time `json:"started_at" db:"started_at"`
	EndAt       time.Time `json:"ended_at" db:"ended_at"`
	Title       string    `json:"title" db:"title"`
	Description string    `json:"description" db:"description"`
	Image       string    `json:"image_url" db:"image_url"`
	Status      string    `json:"status" db:"status"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	CreatedBy   string    `json:"created_by" db:"created_by"`
}
type UpdateAnnounceRequest struct {
	Id          int       `json:"id" db:"id"`
	SchoolId    int       `json:"school_id" db:"school_id"`
	Scope       string    `json:"scope" db:"scope"`
	Type        string    `json:"type" db:"type"`
	StartAt     time.Time `json:"started_at" db:"started_at"`
	EndAt       time.Time `json:"ended_at" db:"ended_at"`
	Title       string    `json:"title" db:"title"`
	Description string    `json:"description" db:"description"`
	Image       string    `json:"image_url" db:"image_url"`
	Status      string    `json:"status" db:"status"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
	UpdatedBy   string    `json:"updated_by" db:"updated_by"`
}

type DeleteRequest struct {
	AnnounceId int `json:"id"`
}

type GetDailyAnnounceResquest struct {
	LoginTime time.Time `json:"login_time"`
	SchoolId  int       `json:"school_id"`
}

type DailyAnnounceResponse struct {
	Id          int    `json:"id" db:"id"`
	StartAt     string `json:"started_at" db:"started_at"`
	EndAt       string `json:"ended_at" db:"ended_at"`
	Title       string `json:"title" db:"title"`
	Description string `json:"description" db:"description"`
	Image       string `json:"image_url" db:"image_url"`
}

type StatusResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

type DataResponse struct {
	StatusCode int         `json:"status_code"`
	Data       interface{} `json:"data"`
	Message    string      `json:"message"`
}

type ListResponse struct {
	StatusCode int         `json:"status_code"`
	Total      int         `json:"total_count"`
	Data       interface{} `json:"data"`
}
