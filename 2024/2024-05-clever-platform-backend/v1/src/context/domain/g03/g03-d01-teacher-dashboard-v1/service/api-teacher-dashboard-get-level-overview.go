package service

import (
	"fmt"
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d01-teacher-dashboard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type LevelOverview struct {
	StatusCode int                 `json:"status_code"`
	Data       []levelOverviewData `json:"data"`
	Message    string              `json:"message"`
}

type levelOverviewData struct {
	TotalLevel  int `json:"total_level"`
	PassedLevel int `json:"passed_level"`
	FailedLevel int `json:"failed_level"`
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
	if len(filter.ClassIds) <= 0 {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &[]string{"class_ids is empty"}[0]))
	}
	result, err := api.service.GetLevelOverview(&getLevelOverviewInput{
		TeacherId:     subjectId,
		AcademicYear:  filter.AcademicYear,
		Year:          filter.Year,
		ClassIds:      filter.ClassIds,
		LessonId:      filter.LessonId,
		StudyGroupIds: filter.StudyGroupIds,
	})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}
	return context.Status(http.StatusOK).JSON(LevelOverview{
		StatusCode: http.StatusOK,
		Data:       []levelOverviewData{result},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type getLevelOverviewInput struct {
	TeacherId     string
	AcademicYear  int
	Year          string
	ClassIds      []int
	LessonId      int
	StudyGroupIds []int
}

func (service serviceStruct) GetLevelOverview(in *getLevelOverviewInput) (out levelOverviewData, err error) {
	out = levelOverviewData{
		TotalLevel:  0,
		PassedLevel: 0,
		FailedLevel: 0,
	}

	levels, err := service.storage.GetClassLevels(in.ClassIds, in.LessonId, in.StudyGroupIds)
	if err != nil {
		err = fmt.Errorf("get level from class ids error: %s", err.Error())
		return
	}

	if len(levels) == 0 {
		return
	}

	levelPlayLogs, err := service.storage.GetLevelPlayLogs(&constant.LevelPlayLogFilter{
		LevelIds:      levels,
		ClassIds:      in.ClassIds,
		StudyGroupIds: in.StudyGroupIds,
	})
	if err != nil {
		err = fmt.Errorf("get levels error: %s", err.Error())
		return
	}

	var (
		totalLevel  = len(levels)
		passedLevel = 0
		unqLevel    = make(map[int]struct{})
	)
	for _, l := range levelPlayLogs {
		if l.Star > 0 {
			if _, exist := unqLevel[l.LevelId]; !exist {
				passedLevel++
				unqLevel[l.LevelId] = struct{}{}
			}
		}
	}

	out.TotalLevel = totalLevel
	out.PassedLevel = passedLevel
	out.FailedLevel = totalLevel - passedLevel
	return
}
