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
type PlayLogStatListResponse struct {
	constant.StatusResponse
	Data []constant.PlayLogStat `json:"data"`
}

func (api *APIStruct) PlayLogStatListGetByParams(context *fiber.Ctx) error {
	var (
		in  constant.PlayLogStatFilter
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

	in.ParseDateTimeFilter(constant.DATE_FORMAT)

	data, err := api.Service.PlayLogStatListGetByParams(in)
	if err != nil {
		if httpError, ok := err.(helper.HttpError); ok {
			return helper.RespondHttpError(context, httpError)
		}
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	return context.Status(http.StatusOK).JSON(PlayLogStatListResponse{
		StatusResponse: constant.NewSuccessReponse(),
		Data:           data,
	})
}

func (service *serviceStruct) PlayLogStatListGetByParams(in constant.PlayLogStatFilter) ([]constant.PlayLogStat, error) {
	studentIds, err := service.repository.StudentIdListGetByStudyGroupId(in.StudyGroupId, in.TeacherId)
	if err != nil {
		return nil, err
	}
	in.StudentIds = studentIds

	ents, err := service.repository.PlayLogStatListGetByParams(in)
	if err != nil {
		return nil, err
	}
	data := make([]constant.PlayLogStat, len(ents))
	for i, ent := range ents {

		data[i] = constant.PlayLogStat{
			StudentIndex:     i + 1,
			UserId:           ent.UserId,
			StudentId:        ent.StudentId,
			StudentTitle:     ent.StudentTitle,
			StudentFirstName: ent.StudentFirstName,
			StudentLastName:  ent.StudentLastName,
			TotalAttempt:     helper.Deref(ent.TotalAttempt),
			TotalPassedLevel: constant.LevelStatistics{
				Value: ent.TotalPassedLevel,
				Total: ent.TotalLevel,
			},
			TotalScore: constant.AvgLevelStatistic{
				Value: float32(helper.Deref(ent.Score)),
				Total: ent.TotalLevel * constant.MAX_STAR_PER_LEVEL,
			},
			AverageTimeUsed: helper.Deref(ent.AvgTimeUsed),
			LastestLoginAt:  ent.LastestLoginAt,
		}
	}
	return data, nil
}
