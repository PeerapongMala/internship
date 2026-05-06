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

type getOverviewStatsResponse struct {
	StatusCode int             `json:"status_code"`
	Data       []overviewStats `json:"data"`
	Message    string          `json:"message"`
}

type overviewStats struct {
	LevelStats levelStats `json:"level_stats"`
	ScoreStats scoreStats `json:"score_stats"`
	TimeStats  timeStats  `json:"time_stats"`
}

type levelStats struct {
	LevelPassed float64 `json:"level_passed"`
	TotalLevel  int     `json:"total_level"`
}

type scoreStats struct {
	AverageScore float64 `json:"average_score"`
	TotalScore   int     `json:"total_score"`
}

type timeStats struct {
	AverageTestTime  float64 `json:"average_test_time"`
	AverageTestTaken float64 `json:"average_test_taken"`
}

// ==================== Endpoint ==========================

func (api apiStruct) GetOverviewStats(context *fiber.Ctx) (err error) {
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	filter, err := helper.ParseAndValidateRequest(context, &constant.GetOverviewStatsFilter{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	if len(filter.LessonIds) <= 0 {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &[]string{"lesson-ids is empty"}[0]))
	}
	result, err := api.service.GetOverviewStats(&getOverviewStatsInput{
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
	return context.Status(http.StatusOK).JSON(getOverviewStatsResponse{
		StatusCode: http.StatusOK,
		Data:       []overviewStats{result},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type getOverviewStatsInput struct {
	TeacherId    string
	StudyGroupId int
	LessonIds    []int
	SubLessonIds []int
	StartAt      *time.Time
	EndAt        *time.Time
}

func (service serviceStruct) GetOverviewStats(in *getOverviewStatsInput) (out overviewStats, err error) {
	out = overviewStats{
		LevelStats: levelStats{
			LevelPassed: 0,
			TotalLevel:  0,
		},
		ScoreStats: scoreStats{
			AverageScore: 0,
			TotalScore:   0,
		},
		TimeStats: timeStats{
			AverageTestTime:  0,
			AverageTestTaken: 0,
		},
	}

	levelPlayLogs, err := service.storage.GetLevelPlayLogsOverviewByStudyGroup(in.StudyGroupId, constant.LevelPlayLogFilter{
		SubLessonIds: in.SubLessonIds,
		LessonIds:    in.LessonIds,
		StartAt:      in.StartAt,
		EndAt:        in.EndAt,
	})
	if err != nil {
		return out, err
	}

	if len(levelPlayLogs) == 0 {

		return out, nil
	}

	data := levelPlayLogs[0]

	out = overviewStats{
		LevelStats: levelStats{
			LevelPassed: data.AvgPassLevel,
			TotalLevel:  data.TotalLevel,
		},
		ScoreStats: scoreStats{
			AverageScore: data.AvgScore,
			TotalScore:   constant.MaxStarPerLevel * data.TotalLevel,
		},
		TimeStats: timeStats{
			AverageTestTime:  float64(data.AvgTimeUsed),
			AverageTestTaken: data.AvgTestTaken,
		},
	}

	return out, nil
}
