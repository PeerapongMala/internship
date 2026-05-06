package helper

import (
	"database/sql"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type Pagination struct {
	Page          int           `json:"page"`
	Limit         sql.NullInt64 `json:"-"`
	LimitResponse int           `json:"limit"`
	Offset        int           `json:"-"`
	TotalCount    int           `json:"total_count"`
	SortBBy       string        `json:"-"`
	SortOrder     string        `json:"-"`
}

type PaginationResponse struct {
	Pagination Pagination `json:"_pagination"`
}

func NewPaginationResponse(pagination *Pagination) PaginationResponse {
	return PaginationResponse{Pagination: *pagination}
}

func PaginationNew(context *fiber.Ctx) *Pagination {
	pagination := &Pagination{}

	page, err := strconv.Atoi(context.Query("page"))
	if err != nil || page < 1 {
		page = 1
	}
	pagination.Page = page

	limit, err := strconv.Atoi(context.Query("limit"))
	if err != nil || limit < -1 {
		limit = 10
	}
	pagination.Limit.Int64 = int64(limit)
	pagination.Limit.Valid = true
	pagination.LimitResponse = limit
	if limit == -1 {
		pagination.Limit.Valid = false
	}

	sortBy := context.Query("sort_by")
	if sortBy == "" {
		sortBy = "id"
	}
	pagination.SortBBy = sortBy

	sortOrder := context.Query("sort_order")
	if sortOrder == "" {
		sortOrder = "desc"
	}
	pagination.SortOrder = sortOrder

	offset := (page - 1) * limit
	pagination.Offset = offset

	return pagination
}

func PaginationDropdown(context *fiber.Ctx) *Pagination {
	pagination := PaginationNew(context)

	limit, err := strconv.Atoi(context.Query("limit", "-1"))
	if err != nil || limit < -1 {
		limit = -1 // Default
	}

	pagination.Limit.Int64 = int64(limit)
	pagination.Limit.Valid = true
	pagination.LimitResponse = limit
	if limit == -1 {
		pagination.Limit.Valid = false
	}

	return pagination
}

func PaginationDefault() *Pagination {
	pagination := &Pagination{
		Page:      1,
		Offset:    0,
		SortBBy:   "id",
		SortOrder: "desc",
	}
	limit := 1000000000
	pagination.Limit.Int64 = int64(limit)
	pagination.Limit.Valid = true
	pagination.LimitResponse = limit

	return pagination
}
