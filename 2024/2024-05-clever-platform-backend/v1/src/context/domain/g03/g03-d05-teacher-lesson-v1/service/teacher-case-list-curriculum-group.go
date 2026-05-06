package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d05-teacher-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type ClassLessonCaseListCurriculumGroupRequest struct {
	ClassId  int  `params:"classId" validate:"required"`
	IsParent bool `query:"is_parent"`
}

// ==================== Response ==========================

type ClassLessonCaseListCurriculumGroupResponse struct {
	StatusCode int                              `json:"status_code"`
	Pagination *helper.Pagination               `json:"_pagination"`
	Data       []constant.CurriculumGroupEntity `json:"data"`
	Message    string                           `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) ClassLessonCaseListCurriculumGroup(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	request, err := helper.ParseAndValidateRequest(context, &ClassLessonCaseListCurriculumGroupRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	classLessonCaseListCurriculumGroupOutput, err := api.Service.ClassLessonCaseListCurriculumGroup(&ClassLessonCaseListCurriculumGroupInput{
		Pagination: pagination,
		SubjectId:  subjectId,
		ClassLessonCaseListCurriculumGroupRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ClassLessonCaseListCurriculumGroupResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       classLessonCaseListCurriculumGroupOutput.CurriculumGroups,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type ClassLessonCaseListCurriculumGroupInput struct {
	Pagination *helper.Pagination
	SubjectId  string
	*ClassLessonCaseListCurriculumGroupRequest
}

type ClassLessonCaseListCurriculumGroupOutput struct {
	CurriculumGroups []constant.CurriculumGroupEntity
}

func (service *serviceStruct) ClassLessonCaseListCurriculumGroup(in *ClassLessonCaseListCurriculumGroupInput) (*ClassLessonCaseListCurriculumGroupOutput, error) {
	err := service.ValidateTeacherClass(&ValidateTeacherClassInput{
		ClassId:   in.ClassId,
		SubjectId: in.SubjectId,
	})
	if err != nil {
		return nil, err
	}

	curriculumGroups, err := service.teacherLessonStorage.TeacherCaseListCurriculumGroup(in.SubjectId, in.ClassId, in.Pagination, in.IsParent)
	if err != nil {
		return nil, err
	}

	return &ClassLessonCaseListCurriculumGroupOutput{curriculumGroups}, nil
}
