package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d01-teacher-dashboard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type bottomStudentsResponse struct {
	StatusCode int               `json:"status_code"`
	Pagination helper.Pagination `json:"_pagination"`
	Data       []bottomStudent   `json:"data"`
	Message    string            `json:"message"`
}

type bottomStudent struct {
	StudentId string `json:"student_id"`
	Name      string `json:"name"`
	Score     int    `json:"score"`
}

// ==================== Endpoint ==========================

func (api *apiStruct) GetBottomStudents(context *fiber.Ctx) (err error) {
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	filter, err := helper.ParseAndValidateRequest(context, &constant.GetBottomStudenetFilter{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	if len(filter.ClassIds) <= 0 {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &[]string{"class_ids is empty"}[0]))
	}
	if len(filter.SubjectIds) <= 0 {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &[]string{"subject_ids is empty"}[0]))
	}
	if len(filter.LessonIds) <= 0 {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, &[]string{"subject_ids is empty"}[0]))
	}
	pagination := helper.PaginationNew(context)

	bottomStudents, err := api.service.GetBottomStudents(&getBottomStudentsInput{
		TeacherId:     subjectId,
		AcademicYear:  filter.AcademicYear,
		Year:          filter.Year,
		ClassIds:      filter.ClassIds,
		StudyGroupIds: filter.StudyGroupIds,
		SubjectIds:    filter.SubjectIds,
		LessonIds:     filter.LessonIds,
		Pagination:    pagination,
	})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}
	return context.Status(http.StatusOK).JSON(bottomStudentsResponse{
		StatusCode: http.StatusOK,
		Pagination: *pagination,
		Data:       bottomStudents,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type getBottomStudentsInput struct {
	TeacherId     string
	AcademicYear  int
	Year          string
	ClassIds      []int
	StudyGroupIds []int
	SubjectIds    []int
	LessonIds     []int
	Pagination    *helper.Pagination
}

func (service *serviceStruct) GetBottomStudents(in *getBottomStudentsInput) (outs []bottomStudent, err error) {
	outs = []bottomStudent{}
	studentScores, err := service.storage.GetStudentScores(in.ClassIds, in.StudyGroupIds, in.LessonIds, in.Pagination, constant.Asc)
	if err != nil {
		return
	}
	for _, studentScore := range studentScores {
		outs = append(outs, bottomStudent{
			StudentId: studentScore.StudentId,
			Name:      studentScore.FullName,
			Score:     studentScore.Sum,
		})
	}
	return
}
