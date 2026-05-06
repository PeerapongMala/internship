package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d01-information-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Endpoint ==========================
type AnnouncementRequest struct {
	SchoolID int `params:"school_id"`
	UserID   string
}

func (api *APIStruct) AnouncementList(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	request, err := helper.ParseAndValidateRequest(context, &AnnouncementRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request.UserID = subjectId

	announcement, err := api.Service.AnouncementList(request, pagination)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(constant.ListResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       announcement,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================
func (service *serviceStruct) AnouncementList(in *AnnouncementRequest, pagination *helper.Pagination) ([]*constant.AnnouncementList, error) {
	announcement, err := service.informationStorage.AnouncementList(in.SchoolID, in.UserID, pagination)
	if err != nil {
		return nil, err
	}

	return announcement, nil
}
