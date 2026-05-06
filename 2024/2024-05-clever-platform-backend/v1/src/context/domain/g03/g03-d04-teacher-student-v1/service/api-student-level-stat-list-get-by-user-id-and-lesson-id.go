package service

import (
	"net/http"
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type StudentLessonStatResponse struct {
	StatusCode int                   `json:"status_code"`
	Message    string                `json:"message"`
	Pagination *helper.Pagination    `json:"_pagination"`
	Data       []constant.LessonStat `json:"data"`
}

func (api *APIStruct) StudentLevelStatListGetByStudentIdAndLessonId(context *fiber.Ctx) error {
	studentId := context.Params("studentId")
	if studentId == "" {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	lessonIdStr := context.Params("lessonId")
	if lessonIdStr == "" {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	lessonId, err := strconv.Atoi(lessonIdStr)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	var filter constant.LessonStatFilter
	if err := context.QueryParser(&filter); err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	if err := filter.DateFilterBase.ParseDateTimeFilter(constant.DATE_FORMAT); err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	filter.Pagination = helper.PaginationNew(context)
	data, err := api.Service.StudentLevelStatListGetByStudentIdAndLessonId(studentId, lessonId, filter)
	if err != nil {
		if httpError, ok := err.(helper.HttpError); ok {
			return helper.RespondHttpError(context, httpError)
		}
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	return context.Status(http.StatusOK).JSON(StudentLessonStatResponse{
		StatusCode: http.StatusOK,
		Message:    "Success",
		Pagination: filter.Pagination,
		Data:       data,
	})
}

func (service *serviceStruct) StudentLevelStatListGetByStudentIdAndLessonId(studentId string, lessonId int, filter constant.LessonStatFilter) ([]constant.LessonStat, error) {
	statEnts, err := service.repositoryTeacherStudent.StudentLevelStatListGetByStudentIdAndLessonId(studentId, lessonId, filter)
	if err != nil {
		return nil, err
	}

	resp := make([]constant.LessonStat, len(statEnts))
	for i, statEnt := range statEnts {
		resp[i] = constant.LessonStat{
			SubLessonId:    statEnt.SubLessonId,
			SubLessonName:  statEnt.SubLessonName,
			SubLessonIndex: statEnt.SubLessonIndex,

			LevelGruop: constant.LevelGroup{
				From: statEnt.MinLevelGroup,
				To:   statEnt.MaxLevelGroup,
			},
			TotalScore: constant.LevelStatistics{
				Value: float32(helper.Deref(statEnt.Score)),
				Total: statEnt.TotalLevel * constant.MAX_STAR_PER_LEVEL,
			},
			TotalPassedLevel: constant.LevelStatistics{
				Value: float32(statEnt.TotalPassedLevel),
				Total: statEnt.TotalLevel,
			},
			BaseStat: constant.BaseStat{
				TotalAttempt:    helper.Deref(statEnt.TotalAttempt),
				LastPlayedAt:    statEnt.LastPlayedAt,
				AverageTimeUsed: helper.Deref(statEnt.AvgTimeUsed),
			},
		}
	}
	return resp, nil
}
