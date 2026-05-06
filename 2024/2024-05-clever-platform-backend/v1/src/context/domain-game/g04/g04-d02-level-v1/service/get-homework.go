package service

import (
	"net/http"
	"slices"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d02-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type GetHomeworkRequest struct {
	SubjectId  int  `params:"id"`
	AllSubject bool `query:"all_subject"`
}

// ==================== Response ==========================
type HomeWorkResponse struct {
	Data []constant.HomeWorkDTO `json:"data"`
	*constant.StatusResponse
}

// ==================== Endpoint ==========================
func (api *APIStruct) GetHomeWork(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &GetHomeworkRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	resp, err := api.Service.GetHomeWork(&GetHomeWorkInput{
		SubjectId:  request.SubjectId,
		UserId:     userId,
		AllSubject: request.AllSubject,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(HomeWorkResponse{
		Data: resp,
		StatusResponse: &constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Data retrieved",
		},
	})
}

type GetHomeWorkInput struct {
	SubjectId  int
	UserId     string
	AllSubject bool
}

func (service *serviceStruct) GetHomeWork(in *GetHomeWorkInput) ([]constant.HomeWorkDTO, error) {

	studentData, err := service.levelStorage.GetStudentData(in.UserId)
	if err != nil {
		return nil, err
	}

	var subjectId *int
	if !in.AllSubject {
		subjectId = &in.SubjectId
	}
	homeworks, err := service.levelStorage.GetListHomeWorkByUserData(subjectId, *studentData, in.UserId)
	if err != nil {
		return nil, err
	}

	resp := []constant.HomeWorkDTO{}
	for _, homework := range homeworks {
		levelIds, err := service.levelStorage.GetLevelByHomeWorkTemplateId(homework.HomeworkTemplateId)
		if err != nil {
			return nil, err
		}

		mapIndexPassLevels, err := service.levelStorage.GetPassLevelIndexByUserIdAndHomeworkId(in.UserId, *homework.HomeworkId)
		if err != nil {
			return nil, err
		}

		nextLevelId, totalLevel, passLevelCount, homeworkIndex := GetHomeworkNextLevel(levelIds, mapIndexPassLevels)

		resp = append(resp, constant.HomeWorkDTO{
			HomeWorkListByUserDataEntity: &homework,
			HomeworkIndex:                homeworkIndex,
			NextLevelId:                  nextLevelId,
			LevelIds:                     levelIds,
			TotalLevel:                   totalLevel,
			PassLevel:                    passLevelCount,
		})
	}

	return resp, nil
}

func GetHomeworkNextLevel(levelIds []int, mapIndexPassLevels map[int][]int) (nextLevelId, totalLevel, passLevelCount, homeworkIndex int) {
	homeworkIndex = 1
	nextLevelId = -1
	passLevelCount = 0
	totalLevel = len(levelIds)

	if len(mapIndexPassLevels) == 0 {
		if len(levelIds) > 0 {
			nextLevelId = levelIds[0]
		}
		return
	}

	for index, passLevels := range mapIndexPassLevels {
		homeworkIndex = index
		for _, levelId := range levelIds {
			passLevelCount = len(passLevels)
			if !slices.Contains(passLevels, levelId) {
				nextLevelId = levelId
				break
			}
		}
	}

	if nextLevelId == -1 {
		nextLevelId = levelIds[0]
	}

	return
}
