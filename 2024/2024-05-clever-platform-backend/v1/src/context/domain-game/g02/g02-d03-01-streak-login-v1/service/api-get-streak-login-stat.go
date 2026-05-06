package service

import (
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d03-01-streak-login-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Response ==========================
type StreakLoginStatResponse struct {
	Data *constant.SubjectCheckinEntity `json:"data"`
	*constant.StatusResponse
}

// ==================== Endpoint ==========================
func (api *APIStruct) GetStreakLoginStat(context *fiber.Ctx) error {

	subjectId, err := context.ParamsInt("subjectId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	resp, err := api.Service.GetStreakLoginStat(&GetStreakLoginStatInput{
		SubjectId: subjectId,
		UserId:    userId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(StreakLoginStatResponse{
		Data: resp,
		StatusResponse: &constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Data retrieved",
		},
	})
}

type GetStreakLoginStatInput struct {
	SubjectId int
	UserId    string
}

func (service *serviceStruct) GetStreakLoginStat(in *GetStreakLoginStatInput) (*constant.SubjectCheckinEntity, error) {

	resp, err := service.subjectCheckinStorage.GetSubjectCheckin(in.UserId, in.SubjectId)
	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			err = service.subjectCheckinStorage.CreateSubjectCheckIn(&constant.SubjectCheckinEntity{
				SubjectId:     in.SubjectId,
				StudentId:     in.UserId,
				LastCheckin:   time.Now().AddDate(0, 0, -1),
				CurrentStreak: 0,
				HighestStreak: 0,
			})
			if err != nil {
				return nil, err
			}

			resp, err = service.subjectCheckinStorage.GetSubjectCheckin(in.UserId, in.SubjectId)
			if err != nil {
				return nil, err
			}

		} else {
			return nil, err
		}
	}

	return resp, nil
}
