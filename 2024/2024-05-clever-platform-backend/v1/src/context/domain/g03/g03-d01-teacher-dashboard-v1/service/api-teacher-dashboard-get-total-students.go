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

type totalStudentsResponse struct {
	StatusCode int            `json:"status_code"`
	Data       []totalStudent `json:"data"`
	Message    string         `json:"message"`
}

type totalStudent struct {
	StudentCount int `json:"student_count"`
}

// ==================== Endpoint ==========================

func (api *apiStruct) GetTotalStudents(context *fiber.Ctx) (err error) {
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	filter, err := helper.ParseAndValidateRequest(context, &constant.GetTotalStudentsFilter{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	result, err := api.service.GetTotalStudents(&getTotalStudentsInput{
		TeacherId:     subjectId,
		AcademicYear:  filter.AcademicYear,
		Year:          filter.Year,
		ClassId:       filter.ClassId,
		StudyGroupIds: filter.StudyGroupIds,
	})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}
	return context.Status(http.StatusOK).JSON(totalStudentsResponse{
		StatusCode: http.StatusOK,
		Data:       []totalStudent{result},
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type getTotalStudentsInput struct {
	TeacherId     string
	AcademicYear  *int
	Year          *string
	ClassId       *int
	StudyGroupIds []int
}

func (service serviceStruct) GetTotalStudents(in *getTotalStudentsInput) (out totalStudent, err error) {
	out = totalStudent{
		StudentCount: 0,
	}

	if len(in.StudyGroupIds) > 0 {
		studentCount, countErr := service.storage.GetTotalStudentCountByStudyGroupIds(in.StudyGroupIds)
		if countErr != nil {
			err = fmt.Errorf("get total student count error: %s", countErr.Error())
			return
		}
		out.StudentCount = studentCount
		return
	}

	if in.ClassId != nil {
		studentCount, countErr := service.storage.GetStudentCount([]int{*in.ClassId})
		if countErr != nil {
			err = fmt.Errorf("get total student count error: %s", countErr.Error())
			return
		}
		out.StudentCount = studentCount
		return
	}

	// get school id
	schoolId, err := service.storage.GetTeacherSchoolId(in.TeacherId)
	if err != nil {
		err = fmt.Errorf("get teacher school id error: %s", err.Error())
		return
	}
	if schoolId == nil {
		err = errors.New("school id is null")
		return
	}

	filter := constant.ClassFilter{}
	if in.AcademicYear != nil {
		filter.AcademicYears = append(filter.AcademicYears, *in.AcademicYear)
	}
	if in.Year != nil {
		filter.Years = append(filter.Years, *in.Year)
	}
	// get class ids
	classIds, err := service.storage.GetTeacherClassIds(*schoolId, in.TeacherId, &filter)
	if err != nil {
		err = fmt.Errorf("get teacher class ids error: %s", err.Error())
		return
	}
	if len(classIds) == 0 {
		return
	}
	studentCount, err := service.storage.GetStudentCount(classIds)
	if err != nil {
		err = fmt.Errorf("get total student count error: %s", err.Error())
		return
	}
	out.StudentCount = studentCount
	return
}

// ==================== Helper ==========================
