package constant

import (
	"time"

	"github.com/google/uuid"
)

type LeaderboardCreateRequest struct {
	Id        uuid.UUID `db:id `
	UserName  string    `db:user_name `
	PassWord  string    `db:pass_word `
	FirstName string    `db:first_name `
	LastName  string    `db:last_name `
	Score     float64   `db:score `
	StartDate time.Time `db:start_date `
	EndDate   time.Time `db:end_date `
}

type LeaderboardGetRequest struct {
	Id        uuid.UUID `db:id `
	UserName  string    `db:user_name `
	PassWord  string    `db:pass_word `
	FirstName string    `db:first_name `
	LastName  string    `db:last_name `
	Score     float64   `db:score `
	StartDate time.Time `db:start_date `
	EndDate   time.Time `db:end_date `
}
type LeaderboardGetResponse struct {
	Id        uuid.UUID `db:id `
	UserName  string    `db:user_name `
	PassWord  string    `db:pass_word `
	FirstName string    `db:first_name `
	LastName  string    `db:last_name `
	Score     float64   `db:score `
	StartDate time.Time `db:start_date `
	EndDate   time.Time `db:end_date `
}
type LeaderboardCreateResponse struct {
	Id        uuid.UUID `db:id `
	UserName  string    `db:user_name `
	PassWord  string    `db:pass_word `
	FirstName string    `db:first_name `
	LastName  string    `db:last_name `
	Score     float64   `db:score `
	StartDate time.Time `db:start_date `
	EndDate   time.Time `db:end_date `
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
type DeleteRequest struct {
	LeaderboardId int64 `json:"id"`
}
type LeaderboardUpdateRequest struct {
	Id        uuid.UUID `db:id `
	UserName  string    `db:user_name `
	PassWord  string    `db:pass_word `
	FirstName string    `db:first_name `
	LastName  string    `db:last_name `
	Score     float64   `db:score `
	StartDate time.Time `db:start_date `
	EndDate   time.Time `db:end_date `
}
