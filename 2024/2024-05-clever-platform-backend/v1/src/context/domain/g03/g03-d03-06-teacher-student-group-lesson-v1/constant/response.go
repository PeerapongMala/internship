package constant

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"

type Response struct {
	StatusCode int         `json:"status_code"`
	Message    string      `json:"message"`
	Data       interface{} `json:"data"`
}

type PaginationResponse struct {
	Response
	Pagination *helper.Pagination `json:"_pagination"`
}
