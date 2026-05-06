package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d01-information-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Response ==========================
type SubjectCheckinCountResponse struct {
	Data *constant.CountResponse `json:"data"`
}

// ==================== Endpoint ==========================
func (api *APIStruct) SubjectCheckinCountGet(context *fiber.Ctx) error {
	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	subjectId, err := context.ParamsInt("subjectId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	resp, err := api.Service.SubjectCheckinCountGet(userId, subjectId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(resp)
}

// ==================== Service ==========================
func (service *serviceStruct) SubjectCheckinCountGet(userId string, subjectId int) (*SubjectCheckinCountResponse, error) {
	count, err := service.informationStorage.GetSubjectCheckinCountById(userId, subjectId)
	if err != nil {
		return nil, err
	}

	return &SubjectCheckinCountResponse{
		Data: &constant.CountResponse{
			Name:  "streak login",
			Count: count,
		},
	}, nil
}
