package service

import (
	"log"
	"net/http"
	"slices"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d02-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"

	"github.com/pkg/errors"
)

// ==================== Response ==========================
type AchivementResponse struct {
	Data []constant.AchivementDTO `json:"data"`
	*constant.StatusResponse
}

// ==================== Endpoint ==========================
func (api *APIStruct) GetAchivement(context *fiber.Ctx) error {

	filterId, err := context.ParamsInt("id")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	queryType := context.Params("type")
	if !slices.Contains([]string{"sub-lesson", "subject"}, queryType) {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	resp, err := api.Service.GetAchivement(&GetAchivementInput{
		FilterId:  filterId,
		UserId:    userId,
		QueryType: queryType,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(AchivementResponse{
		Data: resp,
		StatusResponse: &constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Data retrieved",
		},
	})
}

// ==================== Service ==========================
type GetAchivementInput struct {
	FilterId  int
	UserId    string
	QueryType string
}

func (service *serviceStruct) GetAchivement(in *GetAchivementInput) ([]constant.AchivementDTO, error) {

	var err error
	achivementEntities := []constant.SpecialRewardWithDataEntity{}

	switch in.QueryType {
	case "sub-lesson":
		achivementEntities, err = service.levelStorage.GetAchivementByUserAndSubLessonId(in.UserId, in.FilterId) //sub-lesson-id
	case "subject":
		achivementEntities, err = service.levelStorage.GetAchivementByUserAndSubjectId(in.UserId, in.FilterId) //subject-id
	default:
		err = errors.New("Invalid query type")
	}

	if err != nil {
		return nil, err
	}

	resp := []constant.AchivementDTO{}
	for _, entity := range achivementEntities {
		entity.ReceivedStatus = false
		if entity.ReceivedAt != nil {
			entity.ReceivedStatus = true
		}
		resp = append(resp, constant.AchivementDTO{
			SpecialRewardWithDataEntity: &entity,
		})
	}
	return resp, nil
}
