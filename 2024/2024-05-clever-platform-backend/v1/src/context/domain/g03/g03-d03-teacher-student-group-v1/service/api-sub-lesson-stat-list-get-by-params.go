package service

import (
	"net/http"
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-teacher-student-group-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

// ==================== Response ==========================
type SubLessonStatListResponse struct {
	constant.StatusResponse
	Pagination *helper.Pagination       `json:"_pagination"`
	Data       []constant.SubLessonStat `json:"data"`
}

func (api *APIStruct) SubLessonStatListGetByParams(context *fiber.Ctx) error {
	var (
		in  constant.SubLessonStatFilter
		ok  bool
		err error
	)

	if err := context.QueryParser(&in); err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	in.TeacherId, ok = context.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	studyGroupStr := context.Params("studyGroupId")
	if studyGroupStr == "" {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	in.StudyGroupId, err = strconv.Atoi(studyGroupStr)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	lessonIdStr := context.Params("lessonId")
	if studyGroupStr == "" {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	in.LessonId, err = strconv.Atoi(lessonIdStr)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	in.ParseDateTimeFilter(constant.DATE_FORMAT)
	in.Pagination = helper.PaginationNew(context)

	data, err := api.Service.SubLessonStatListGetByParams(in)
	if err != nil {
		if httpError, ok := err.(helper.HttpError); ok {
			return helper.RespondHttpError(context, httpError)
		}
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	return context.Status(http.StatusOK).JSON(SubLessonStatListResponse{
		StatusResponse: constant.NewSuccessReponse(),
		Pagination:     in.Pagination,
		Data:           data,
	})
}

func (service *serviceStruct) SubLessonStatListGetByParams(in constant.SubLessonStatFilter) ([]constant.SubLessonStat, error) {
	studentIds, err := service.repository.StudentIdListGetByStudyGroupId(in.StudyGroupId, in.TeacherId)
	if err != nil {
		return nil, err
	}

	if len(studentIds) == 0 {
		return make([]constant.SubLessonStat, 0), nil
	}

	in.StudentIds = studentIds
	numStudent := len(in.StudentIds)

	ents, err := service.repository.SubLessonStatListGetByParams(in)
	if err != nil {
		return nil, err
	}
	data := make([]constant.SubLessonStat, len(ents))
	for i, ent := range ents {
		data[i] = constant.SubLessonStat{
			SubLessonId:    ent.SubLessonId,
			SubLessonIndex: ent.SubLessonIndex,
			SubLessonName:  ent.SubLessonName,
			LevelGruop: constant.LevelGroup{
				From: ent.MinLevelGroup,
				To:   ent.MaxLevelGroup,
			},

			TotalPassedLevel: constant.LevelStatistics{
				Value: ent.TotalPassedLevel / float32(numStudent),
				Total: ent.TotalLevel,
			},
			TotalScore: constant.AvgLevelStatistic{
				Value: float32(helper.Deref(ent.Score)) / float32(numStudent),
				Total: ent.TotalLevel * constant.MAX_STAR_PER_LEVEL,
			},
			BaseStat: constant.BaseStat{
				AverageTimeUsed:     helper.Deref(ent.AvgTimeUsed) / float32(numStudent),
				AverageTotalAttempt: float32(helper.Deref(ent.TotalAttempt)) / float32(numStudent),
				LastPlayedAt:        ent.LastPlayedAt,
			},
		}
	}
	return data, nil
}
