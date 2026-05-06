package service

import (
	"net/http"
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type LevelPlayStatResponse struct {
	StatusCode int                      `json:"status_code"`
	Pagination *helper.Pagination       `json:"_pagination"`
	Message    string                   `json:"message"`
	Data       []constant.LevelPlayStat `json:"data"`
}

func (api *APIStruct) StudentLevelStatListGetByStudentIdAndLevelId(context *fiber.Ctx) error {
	pagination := helper.PaginationDropdown(context)
	studentId := context.Params("studentId")
	if studentId == "" {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	levelIdStr := context.Params("levelId")
	if levelIdStr == "" {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	levelId, err := strconv.Atoi(levelIdStr)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	data, err := api.Service.StudentLevelStatListGetByStudentIdAndLevelId(studentId, levelId, pagination)
	if err != nil {
		if httpError, ok := err.(helper.HttpError); ok {
			return helper.RespondHttpError(context, httpError)
		}
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	return context.Status(http.StatusOK).JSON(LevelPlayStatResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Message:    "Success",
		Data:       data,
	})
}

func (service *serviceStruct) StudentLevelStatListGetByStudentIdAndLevelId(studentId string, levelId int, pagination *helper.Pagination) ([]constant.LevelPlayStat, error) {
	statEnts, err := service.repositoryTeacherStudent.StudentLevelStatListGetByStudentIdAndSubLevelId(studentId, levelId, pagination)
	if err != nil {
		return nil, err
	}

	resp := make([]constant.LevelPlayStat, len(statEnts))
	for i, statEnt := range statEnts {
		resp[i] = constant.LevelPlayStat{
			PlayLogId:       statEnt.PlayLogId,
			PlaySequence:    statEnt.PlaySequence,
			Score:           statEnt.Score,
			MaxScore:        constant.MAX_STAR_PER_LEVEL,
			AverageTimeUsed: statEnt.AverageTimeUsed,
			PlayedAt:        statEnt.PlayedAt,
		}
	}
	return resp, nil
}
