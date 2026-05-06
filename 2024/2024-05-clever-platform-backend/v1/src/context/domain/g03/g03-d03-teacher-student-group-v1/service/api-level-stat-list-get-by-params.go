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
type LevelStatListResponse struct {
	constant.StatusResponse
	Data       []constant.LevelStat `json:"data"`
	Pagination helper.Pagination    `json:"_pagination"`
}

func (api *APIStruct) LevelStatListGetByParams(context *fiber.Ctx) error {
	var (
		in  constant.LevelStatFilter
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

	subLessonIdStr := context.Params("subLessonId")
	if studyGroupStr == "" {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	in.SubLessonId, err = strconv.Atoi(subLessonIdStr)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	in.Pagination = helper.PaginationNew(context)

	in.ParseDateTimeFilter(constant.DATE_FORMAT)

	data, err := api.Service.LevelStatListGetByParams(in)
	if err != nil {
		if httpError, ok := err.(helper.HttpError); ok {
			return helper.RespondHttpError(context, httpError)
		}
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	return context.Status(http.StatusOK).JSON(LevelStatListResponse{
		Pagination:     *in.Pagination,
		StatusResponse: constant.NewSuccessReponse(),
		Data:           data,
	})
}

func (service *serviceStruct) LevelStatListGetByParams(in constant.LevelStatFilter) ([]constant.LevelStat, error) {
	studentIds, err := service.repository.StudentIdListGetByStudyGroupId(in.StudyGroupId, in.TeacherId)
	if err != nil {
		return nil, err
	}

	if len(studentIds) == 0 {
		return make([]constant.LevelStat, 0), nil
	}

	in.StudentIds = studentIds
	numStudent := len(in.StudentIds)

	ents, err := service.repository.LevelStatListGetByParams(in)
	if err != nil {
		return nil, err
	}
	data := make([]constant.LevelStat, len(ents))
	for i, ent := range ents {
		data[i] = constant.LevelStat{
			LevelId:      ent.LevelId,
			LevelIndex:   ent.LevelIndex,
			LevelType:    ent.LevelType,
			QuestionType: ent.QuestionType,
			Difficulty:   ent.Difficulty,
			TotalScore: constant.AvgLevelStatistic{
				Value: float32(helper.Deref(ent.Score)) / float32(numStudent),
				Total: constant.MAX_STAR_PER_LEVEL,
			},
			UserPlayCount: constant.LevelStatistics{
				Value: float32(ent.UserPlayCount),
				Total: numStudent,
			},
			BaseStat: constant.BaseStat{
				AverageTimeUsed:     helper.Deref(ent.AvgTimeUsed) / float32(numStudent),
				AverageTotalAttempt: float32(helper.Deref(ent.TotalAttempt)) / float32(numStudent),
				LastPlayedAt:        ent.LastPlayedAt,
			},
			TotalAttempt: helper.Deref(ent.TotalAttempt),
		}
	}
	return data, nil
}
