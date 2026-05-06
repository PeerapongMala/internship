package service

import (
	"net/http"
	"slices"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d02-global-zone-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type AnnouncementRequest struct {
	AnnouncementType string `query:"type" validate:"required"`
	UserId           string
}

type AnnouncementResponse struct {
	Data []constant.AnnouncementEntity `json:"data"`
	*constant.StatusResponse
}

// ==================== Endpoint ==========================
func (api *APIStruct) AnnouncementGet(context *fiber.Ctx) error {

	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request, err := helper.ParseAndValidateRequest(context, &AnnouncementRequest{UserId: userId}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	if !slices.Contains([]string{"system", "teacher"}, request.AnnouncementType) {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	resp, err := api.Service.AnnouncementGet(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	resp.StatusResponse = &constant.StatusResponse{
		Message:    "Success",
		StatusCode: http.StatusOK,
	}

	return context.Status(http.StatusOK).JSON(resp)
}

// ==================== Service ==========================
func (service *serviceStruct) AnnouncementGet(in *AnnouncementRequest) (*AnnouncementResponse, error) {

	schoolId, err := service.globalZoneStorage.GetSchoolByStudentId(in.UserId)
	if err != nil {
		return nil, err
	}

	announcement, err := service.globalZoneStorage.GetAnnouncementGlobalZone(schoolId, in.UserId, in.AnnouncementType)
	if err != nil {
		return nil, err
	}

	return &AnnouncementResponse{
		Data: announcement,
	}, nil
}
