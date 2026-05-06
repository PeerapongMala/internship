package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d02-global-zone-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type selectSubjectResponse struct {
	Data []constant.SubjectResponse `json:"data"`
	*constant.StatusResponse
}

// ==================== Endpoint ==========================
func (api *APIStruct) GlobalZoneSelectSubjectGet(context *fiber.Ctx) error {
	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	resp, err := api.Service.GlobalZoneSelectSubjectGet(userId)
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
func (service *serviceStruct) GlobalZoneSelectSubjectGet(userId string) (*selectSubjectResponse, error) {
	subjects, err := service.globalZoneStorage.GetSubjectsBySchoolId(userId)
	if err != nil {
		return nil, err
	}

	return &selectSubjectResponse{
		Data: subjects,
	}, nil
}
