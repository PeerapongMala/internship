package constant

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"

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
	StatusCode int                `json:"status_code"`
	Pagination *helper.Pagination `json:"_pagination"`
	Data       interface{}        `json:"data"`
	Message    string             `json:"message"`
}
