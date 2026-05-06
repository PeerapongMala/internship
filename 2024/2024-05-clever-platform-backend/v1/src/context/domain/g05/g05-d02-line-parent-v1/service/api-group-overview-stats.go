package service

import (
	"log"
	"math"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
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
	PointStats pointStats `json:"point_stats"`
}

type levelStats struct {
	LevelPassed   int     `json:"level_passed"`
	LevelFailed   int     `json:"level_failed"`
	TotalLevel    int     `json:"total_level"`
	PassedPercent float64 `json:"pass_percent"`
	FailedPercent float64 `json:"failed_percent"`
}

type scoreStats struct {
	Score      int `json:"score"`
	TotalScore int `json:"total_score"`
}

type pointStats struct {
	Count int `json:"attemp_count"`
}

type timeStats struct {
	AverageTestTime float64 `json:"average_test_time"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) GetOverviewStats(context *fiber.Ctx) (err error) {
	filter, err := helper.ParseAndValidateRequest(context, &constant.OverViewStatusFilter{}, helper.ParseOptions{Query: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	log.Println("filter: ", filter)
	result, err := api.Service.GetOverviewStats(filter)
	if err != nil {
		errMsg := err.Error()
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, &errMsg))
	}
	log.Println("result: ", result)
	return context.Status(http.StatusOK).JSON(constant.DataResponse{
		StatusCode: http.StatusOK,
		Data:       result,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================
func (service serviceStruct) GetOverviewStats(in *constant.OverViewStatusFilter) (*overviewStats, error) {
	output := overviewStats{
		LevelStats: levelStats{
			LevelPassed:   0,
			LevelFailed:   0,
			TotalLevel:    0,
			PassedPercent: 0,
			FailedPercent: 0,
		},
		ScoreStats: scoreStats{
			Score:      0,
			TotalScore: 0,
		},
		TimeStats: timeStats{
			AverageTestTime: 0,
		},
		PointStats: pointStats{
			Count: 0,
		},
	}

	playLogData, err := service.lineParentStorage.GetLevelTotalByStudentAndSubject(in)
	if err != nil {
		return nil, err
	}

	playLogCount, err := service.lineParentStorage.GetLevelPlayLogAttemtCount(in)
	if err != nil {
		return nil, err
	}

	log.Println("playLogData: ", playLogData)
	log.Println("playLogCount: ", playLogCount)

	levelPassed := 0
	totalLevel := len(playLogData)
	sumScore := 0
	totalScore := len(playLogData) * 3
	totalTestTime := 0

	for _, lpl := range playLogData {
		if lpl.Star > 0 {
			levelPassed += 1
			sumScore += lpl.Star
		}
		totalTestTime += lpl.TimeUsed
	}

	output.LevelStats.LevelPassed = levelPassed
	output.LevelStats.LevelFailed = totalLevel - levelPassed

	var percentPass float64
	var percentFail float64
	if totalLevel != 0 {
		percentPass = float64(levelPassed*100) / float64(totalLevel)
		percentFail = float64((totalLevel-levelPassed)*100) / float64(totalLevel)

		output.TimeStats.AverageTestTime = float64(totalTestTime) / float64(totalLevel)
	} else {
		percentPass = 0
		percentFail = 0

		output.TimeStats.AverageTestTime = float64(0)
	}

	output.LevelStats.PassedPercent = roundFloat(percentPass, 1)
	output.LevelStats.FailedPercent = roundFloat(percentFail, 1)
	output.LevelStats.TotalLevel = totalLevel

	output.ScoreStats.Score = sumScore
	output.ScoreStats.TotalScore = totalScore

	output.PointStats.Count = playLogCount

	log.Println("output: ", output)

	return &output, nil
}

func roundFloat(val float64, precision uint) float64 {
	ratio := math.Pow(10, float64(precision))
	return math.Round(val*ratio) / ratio
}
