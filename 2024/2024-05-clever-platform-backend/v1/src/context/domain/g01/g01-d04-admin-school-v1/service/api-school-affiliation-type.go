package service

import (
	"database/sql"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

func (api *APIStruct) SchoolAffilitaionType(context *fiber.Ctx) error {
	SchoolAffiliationType := []map[string]string{
		{"type": "รัฐ"},
		{"type": "เอกชน"},
		{"type": "อื่นๆ"},
	}

	limit := sql.NullInt64{
		Int64: 10,
		Valid: true,
	}
	return context.Status(fiber.StatusOK).JSON(constant.ListResponse{
		StatusCode: fiber.StatusOK,
		Pagination: &helper.Pagination{
			Page:       1,
			Limit:      limit,
			TotalCount: 3,
		},
		Data:    SchoolAffiliationType,
		Message: "Data retrived",
	})
}
