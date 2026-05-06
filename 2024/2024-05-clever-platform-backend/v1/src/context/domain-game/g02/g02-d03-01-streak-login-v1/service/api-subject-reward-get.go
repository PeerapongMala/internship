package service

import (
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d03-01-streak-login-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

// ==================== Request ==========================

// ==================== Response ==========================
type SubjectRewardGetBySubjectIdResponse struct {
	Data 	[]constant.SubjectRewardWithItemEntity `json:"data"`
	*constant.StatusResponse
}

// ==================== Endpoint ==========================

func (api *APIStruct) SubjectRewardGetBySubjectId(context *fiber.Ctx) error {
	
	subjectId, err := context.ParamsInt("subjectId")
	if err != nil {
		return helper.RespondHttpError(context, err) // Handle error if subjectId is not a valid integer
	}

	reward, err := api.Service.SubjectRewardGetBySubjectId(subjectId)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(SubjectRewardGetBySubjectIdResponse{
		Data:    reward,
		StatusResponse: &constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Data retrieved",
		},
	})

}

// ==================== Service ==========================
func (service *serviceStruct) SubjectRewardGetBySubjectId(subjectId int) ([]constant.SubjectRewardWithItemEntity, error) {
	
	rewards, err := service.subjectCheckinStorage.GetSubjectRewardBySubjectId(subjectId)
	if err != nil {
		return nil, err
	}

	return rewards, nil

}
