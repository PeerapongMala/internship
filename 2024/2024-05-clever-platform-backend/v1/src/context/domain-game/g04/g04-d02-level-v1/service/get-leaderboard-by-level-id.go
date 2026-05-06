package service

import (
	"fmt"
	"log"
	"net/http"
	"slices"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d02-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================
type LeaderBoardByLevelIdRequest struct {
	LevelId    int    `params:"id"`
	FilterType string `query:"filterType"`
	StartDate  string `query:"startDate"`
	EndDate    string `query:"endDate"`
}

// ==================== Response ==========================
type LeaderBoardByLevelIdResponse struct {
	Pagination *helper.Pagination               `json:"_pagination"`
	Data       []constant.LeaderBoardDataEntity `json:"data"`
	*constant.StatusResponse
}

// ==================== Endpoint ========1==================
func (api *APIStruct) GetLeaderBoardByLevelId(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	request, err := helper.ParseAndValidateRequest(context, &LeaderBoardByLevelIdRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	if !slices.Contains([]string{"all", "affiliation", "school", "class"}, request.FilterType) {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	resp, err := api.Service.GetLeaderBoardByLevelId(&GetLeaderBoardByLevelIdInput{
		UserId:     userId,
		LevelId:    request.LevelId,
		FilterType: request.FilterType,
		StartDate:  request.StartDate,
		EndDate:    request.EndDate,
		Pagination: pagination,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LeaderBoardByLevelIdResponse{
		Pagination: pagination,
		Data:       resp,
		StatusResponse: &constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Data retrieved",
		},
	})
}

type GetLeaderBoardByLevelIdInput struct {
	LevelId    int
	UserId     string
	FilterType string
	StartDate  string
	EndDate    string
	Pagination *helper.Pagination
}

func (service *serviceStruct) GetLeaderBoardByLevelId(in *GetLeaderBoardByLevelIdInput) ([]constant.LeaderBoardDataEntity, error) {
	in.Pagination.Limit.Int64 = 10
	in.Pagination.LimitResponse = 10
	userData, err := service.levelStorage.GetStudentDataDetail(in.UserId)
	if err != nil {
		return nil, err
	}

	var entities []constant.LeaderBoardDataEntity
	key := fmt.Sprintf(`%s-level-%d-%s-%s-%s`, in.UserId, in.LevelId, in.FilterType, in.StartDate, in.EndDate)
	value, isValid := service.cache.Get(key)

	if !isValid {
		switch in.FilterType {
		case "all":
			entities, err = service.levelStorage.GetLeaderBoardAll([]int{in.LevelId}, in.StartDate, in.EndDate, in.Pagination, in.UserId)
		case "affiliation":
			entities, err = service.levelStorage.GetLeaderBoardBySchoolAffiliationId([]int{in.LevelId}, *userData.SchoolAffiliationId, in.StartDate, in.EndDate, in.Pagination, in.UserId)
		case "school":
			entities, err = service.levelStorage.GetLeaderBoardBySchoolId([]int{in.LevelId}, *userData.SchoolId, in.StartDate, in.EndDate, in.Pagination, in.UserId)
		case "class":
			entities, err = service.levelStorage.GetLeaderBoardByClassId([]int{in.LevelId}, *userData.ClassId, in.StartDate, in.EndDate, in.Pagination, in.UserId)
		}

		service.cache.Set(key, entities, 10*time.Second)
	} else {
		entities, _ = value.([]constant.LeaderBoardDataEntity)
	}

	if err != nil {
		return nil, err
	}

	for index, entity := range entities {
		if entity.UserId != nil && *entity.UserId == in.UserId {
			entities[index].MeFlag = true
		}
	}

	return entities, nil
}
