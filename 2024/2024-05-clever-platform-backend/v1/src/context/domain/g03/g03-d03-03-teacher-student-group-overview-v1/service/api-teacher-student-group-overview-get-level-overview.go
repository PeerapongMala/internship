package service

import (
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-03-teacher-student-group-overview-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type getLevelOverviewResponse struct {
	StatusCode int             `json:"status_code"`
	Data       []levelOverview `json:"data"`
	Message    string          `json:"message"`
}

type levelOverview struct {
	TotalLevel  int     `json:"total_level"`
	LevelPassed float64 `json:"level_passed"`
	LevelFailed float64 `json:"level_failed"`
}

// ==================== Endpoint ==========================

func (api apiStruct) GetLevelOverview(context *fiber.Ctx) (err error) {
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	filter, err := helper.ParseAndValidateRequest(context, &constant.GetLevelOverviewFilter{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	if len(filter.LessonIds) <= 0 {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &[]string{"lesson-ids is empty"}[0]))
	}

	result, err := api.service.GetLevelOverview(&getLevelOverviewInput{
		TeacherId:    subjectId,
		StudyGroupId: filter.StudyGroupId,
		LessonIds:    filter.LessonIds,
		SubLessonIds: filter.SubLessonIds,
		StartAt:      filter.StartAt,
		EndAt:        filter.EndAt,
	})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}
	return context.Status(http.StatusOK).JSON(getLevelOverviewResponse{
		StatusCode: http.StatusOK,
		Data:       []levelOverview{result},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type getLevelOverviewInput struct {
	TeacherId    string
	StudyGroupId int
	LessonIds    []int
	SubLessonIds []int
	StartAt      *time.Time
	EndAt        *time.Time
}

func (service serviceStruct) GetLevelOverview(in *getLevelOverviewInput) (out levelOverview, err error) {
	out = levelOverview{
		TotalLevel:  0,
		LevelPassed: 0,
		LevelFailed: 0,
	}

	studyGroup, err := service.storage.GetStudyGroup(in.StudyGroupId)
	if err != nil {
		err = errors.Errorf("get study group from id error: %s", err.Error())
		return
	}

	levelPlayLogsOverView, err := service.storage.GetLevelPlayLogsOverviewByStudyGroup(
		studyGroup.Id,
		constant.LevelPlayLogFilter{
			SubLessonIds: in.SubLessonIds,
			LessonIds:    in.LessonIds,
			StartAt:      in.StartAt,
			EndAt:        in.EndAt,
		},
	)
	if err != nil {
		err = errors.Errorf("get level play logs error: %s", err.Error())
		return
	}

	data := levelPlayLogsOverView[0]

	out.TotalLevel = data.TotalLevel
	out.LevelPassed = float64(data.AvgPassLevel)
	out.LevelFailed = float64(data.TotalLevel) - data.AvgPassLevel
	return
}
