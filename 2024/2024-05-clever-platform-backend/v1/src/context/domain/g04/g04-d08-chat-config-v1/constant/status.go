package constant

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"

type ListResponse struct {
	StatusCode int                `json:"status_code"`
	Pagination *helper.Pagination `json:"_pagination"`
	Data       interface{}        `json:"data"`
	Message    string
}

type StatusResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}
