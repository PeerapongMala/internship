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

type topStudentsResponse struct {
	StatusCode int               `json:"status_code"`
	Pagination helper.Pagination `json:"_pagination"`
	Data       []topStudent      `json:"data"`
	Message    string            `json:"message"`
}

type topStudent struct {
	StudentId string `json:"student_id"`
	Name      string `json:"name"`
	Score     int    `json:"score"`
}

// ==================== Endpoint ==========================

func (api *apiStruct) GetTopStudents(context *fiber.Ctx) (err error) {
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	filter, err := helper.ParseAndValidateRequest(context, &constant.GetTopStudenetFilter{}, helper.ParseOptions{Query: true})
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

	topStudents, err := api.service.GetTopStudents(&getTopStudentsInput{
		TeacherId:     subjectId,
		AcademicYear:  filter.AcademicYear,
		Year:          filter.Year,
		ClassIds:      filter.ClassIds,
		SubjectIds:    filter.SubjectIds,
		LessonIds:     filter.LessonIds,
		StudyGroupIds: filter.StudyGroupIds,
		Pagination:    pagination,
	})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}
	return context.Status(http.StatusOK).JSON(topStudentsResponse{
		StatusCode: http.StatusOK,
		Pagination: *pagination,
		Data:       topStudents,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type getTopStudentsInput struct {
	TeacherId     string
	AcademicYear  int
	Year          string
	ClassIds      []int
	SubjectIds    []int
	LessonIds     []int
	StudyGroupIds []int
	Pagination    *helper.Pagination
}

func (service *serviceStruct) GetTopStudents(in *getTopStudentsInput) (outs []topStudent, err error) {
	outs = []topStudent{}
	studentScores, err := service.storage.GetStudentScores(in.ClassIds, in.StudyGroupIds, in.LessonIds, in.Pagination, constant.Desc)
	if err != nil {
		return
	}
	for _, studentScore := range studentScores {
		outs = append(outs, topStudent{
			StudentId: studentScore.StudentId,
			Name:      studentScore.FullName,
			Score:     studentScore.Sum,
		})
	}
	return
}
