package service

import (
	"net/http"
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type SubLessonStatResponse struct {
	StatusCode int                      `json:"status_code"`
	Pagination *helper.Pagination       `json:"_pagination"`
	Message    string                   `json:"message"`
	Data       []constant.SubLessonStat `json:"data"`
}

func (api *APIStruct) StudentLevelStatListGetByStudentIdAndSubLessonId(context *fiber.Ctx) error {
	pagination := helper.PaginationDropdown(context)
	studentId := context.Params("studentId")
	if studentId == "" {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subLessonIdStr := context.Params("subLessonId")
	if studentId == "" {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subLessonId, err := strconv.Atoi(subLessonIdStr)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	var filter constant.SubLessonStatFilter
	if err := context.QueryParser(&filter); err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	if err := filter.DateFilterBase.ParseDateTimeFilter(constant.DATE_FORMAT); err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	filter.Pagination = pagination
	data, err := api.Service.StudentLevelStatListGetByStudentIdAndSubLessonId(studentId, subLessonId, filter)
	if err != nil {
		if httpError, ok := err.(helper.HttpError); ok {
			return helper.RespondHttpError(context, httpError)
		}
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	return context.Status(http.StatusOK).JSON(SubLessonStatResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Message:    "Success",
		Data:       data,
	})
}

func (service *serviceStruct) StudentLevelStatListGetByStudentIdAndSubLessonId(studentId string, subLessonId int, filter constant.SubLessonStatFilter) ([]constant.SubLessonStat, error) {
	statEnts, err := service.repositoryTeacherStudent.StudentLevelStatListGetByStudentIdAndSubLessonId(studentId, subLessonId, filter)
	if err != nil {
		return nil, err
	}

	resp := make([]constant.SubLessonStat, len(statEnts))
	for i, statEnt := range statEnts {
		resp[i] = constant.SubLessonStat{
			LevelId:      statEnt.LevelId,
			LevelIndex:   statEnt.LevelIndex,
			LevelType:    statEnt.LevelType,
			QuestionType: statEnt.QuestionType,
			Difficulty:   statEnt.Difficulty,
			TotalScore: constant.LevelStatistics{
				Value: float32(helper.Deref(statEnt.Score)),
				Total: constant.MAX_STAR_PER_LEVEL,
			},
			BaseStat: constant.BaseStat{
				TotalAttempt: helper.Deref(statEnt.TotalAttempt),
				LastPlayedAt: statEnt.LastPlayedAt,
			},
		}
		resp[i].AverageTimeUsed = float32(helper.Round(float64(helper.Deref(statEnt.AvgTimeUsed))))
		//if statEnt.TotalAttempt != nil && *statEnt.TotalAttempt != 0 {
		//	resp[i].AverageTimeUsed = float32(helper.Deref(statEnt.TotalTimeUsed)) / float32(helper.Deref(statEnt.TotalAttempt))
		//}
	}
	return resp, nil

}
