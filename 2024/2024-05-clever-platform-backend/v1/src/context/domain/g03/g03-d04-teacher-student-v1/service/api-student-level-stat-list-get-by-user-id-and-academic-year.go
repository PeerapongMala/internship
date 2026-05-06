package service

import (
	"net/http"
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
)

type StudentAcademicYearStatResponse struct {
	StatusCode int                                `json:"status_code"`
	Pagination *helper.Pagination                 `json:"_pagination"`
	Message    string                             `json:"message"`
	Data       []constant.StudentAcademicYearStat `json:"data"`
}

func (api *APIStruct) StudentLevelStatListGetByStudentIdAndAcademicYear(context *fiber.Ctx) error {
	pagination := helper.PaginationDropdown(context)
	studentId := context.Params("studentId")
	if studentId == "" {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	academicYearStr := context.Params("academicYear")
	if academicYearStr == "" {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	academicYear, err := strconv.Atoi(academicYearStr)
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	var filter constant.StudentAcademicYearStatFilter
	if err := context.QueryParser(&filter); err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	filter.Pagination = pagination
	data, err := api.Service.StudentLevelStatListGetByStudentIdAndAcademicYear(studentId, academicYear, filter)
	if err != nil {
		if httpError, ok := err.(helper.HttpError); ok {
			return helper.RespondHttpError(context, httpError)
		}
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	return context.Status(http.StatusOK).JSON(StudentAcademicYearStatResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Message:    "Success",
		Data:       data,
	})
}

func (service *serviceStruct) StudentLevelStatListGetByStudentIdAndAcademicYear(studentId string, academicYear int, filter constant.StudentAcademicYearStatFilter) ([]constant.StudentAcademicYearStat, error) {
	//student, err := service.repositoryTeacherStudent.StudentByStudentId(studentId)
	//if err != nil {
	//	return nil, err
	//}

	statEnts, err := service.repositoryTeacherStudent.StudentLevelStatListGetByStudentIdAndAcademicYear(studentId, academicYear, filter)
	if err != nil {
		return nil, err
	}

	resp := make([]constant.StudentAcademicYearStat, len(statEnts))
	for i, statEnt := range statEnts {
		resp[i] = constant.StudentAcademicYearStat{
			ClassId:                  statEnt.Id,
			AcademicYear:             statEnt.AcademicYear,
			ClassYear:                statEnt.Year,
			ClassName:                statEnt.Name,
			CurriculumGroupShortName: statEnt.CurriculumGroupShortName,
			SubjectName:              statEnt.SubjectName,
			LessonId:                 statEnt.LessonId,
			LessonIndex:              statEnt.LessonIndex,
			LessonName:               statEnt.LessonName,
			TotalScore: constant.LevelStatistics{
				Value: float32(helper.Deref(statEnt.Score)),
				Total: helper.Deref(statEnt.TotalLevel) * constant.MAX_STAR_PER_LEVEL,
			},
			TotalPassedLevel: constant.LevelStatistics{
				Value: float32(helper.Deref(statEnt.TotalPassedLevel)),
				Total: helper.Deref(statEnt.TotalLevel),
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
