package service

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type StudentCaseLessonPlayLogDownloadCsvRequest struct {
	UserId    string `params:"userId" validate:"required"`
	ClassId   int    `params:"classId" validate:"required"`
	StartDate string `query:"start_date"`
	EndDate   string `query:"end_date"`
}

// ==================== Response ==========================

// ==================== Endpoint ==========================

func (api *APIStruct) StudentCaseLessonPlayLogDownloadCsv(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &StudentCaseLessonPlayLogDownloadCsvRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	if request.StartDate != "" {
		_, err := time.Parse(time.RFC3339, request.StartDate)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return helper.RespondHttpError(context, err)
		}
	}
	if request.EndDate != "" {
		_, err := time.Parse(time.RFC3339, request.EndDate)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return helper.RespondHttpError(context, err)
		}
	}

	studentCaseLessonPlayLogDownloadCsvOutput, err := api.Service.StudentCaseLessonPlayLogDownloadCsv(&StudentCaseLessonPlayLogDownloadCsvInput{
		UserId:    request.UserId,
		ClassId:   request.ClassId,
		StartDate: request.StartDate,
		EndDate:   request.EndDate,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	context.Set("Content-Type", "text/csv")
	context.Set("Content-Disposition", "attachment; filename=lesson-play-log.csv")
	return context.Status(http.StatusOK).Send(studentCaseLessonPlayLogDownloadCsvOutput.FileContent)
}

// ==================== Service ==========================

type StudentCaseLessonPlayLogDownloadCsvInput struct {
	UserId    string
	ClassId   int
	StartDate string
	EndDate   string
}

type StudentCaseLessonPlayLogDownloadCsvOutput struct {
	FileContent []byte
}

func (service *serviceStruct) StudentCaseLessonPlayLogDownloadCsv(in *StudentCaseLessonPlayLogDownloadCsvInput) (*StudentCaseLessonPlayLogDownloadCsvOutput, error) {
	lessonPlayLogs, err := service.adminSchoolStorage.StudentCaseListLessonPlayLog(in.UserId, in.ClassId, &constant.LessonPlayLogFilter{
		StartDate: in.StartDate,
		EndDate:   in.EndDate,
	}, nil)
	if err != nil {
		return nil, err
	}

	location, err := time.LoadLocation("Asia/Bangkok")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	csvData := [][]string{constant.LessonPlayLogCsvHeader}
	for i, lessonPlayLog := range lessonPlayLogs {
		csvData = append(csvData, []string{
			strconv.Itoa(i + 1),
			strconv.Itoa(lessonPlayLog.AcademicYear),
			lessonPlayLog.Year,
			lessonPlayLog.Class,
			lessonPlayLog.CurriculumGroup,
			lessonPlayLog.Subject,
			lessonPlayLog.Lesson,
			fmt.Sprintf(`%d/%d`, lessonPlayLog.PassedLevelCount, lessonPlayLog.TotalLevelCount),
			fmt.Sprintf(`%d/%d`, lessonPlayLog.PointCount, lessonPlayLog.TotalPoint),
			strconv.Itoa(lessonPlayLog.PlayCount),
			strconv.FormatFloat(float64(lessonPlayLog.AvgTimePerQuestion), 'f', 2, 64),
			lessonPlayLog.LastPlayedAt.In(location).Format("2006-01-02 15:04:05"),
		})
	}

	bytes, err := helper.WriteCSV(csvData, nil)
	if err != nil {
		return nil, err
	}

	return &StudentCaseLessonPlayLogDownloadCsvOutput{FileContent: bytes}, nil
}
