package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"log"
	"net/http"
)

// ==================== Request ==========================

type LessonCaseListBySubjectRequest struct {
	SubjectId int `params:"subjectId" validate:"required"`
}

// ==================== Response ==========================

type LessonCaseListBySubjectResponse struct {
	StatusCode int                         `json:"status_code"`
	Data       []constant.LessonDataEntity `json:"data"`
	Message    string                      `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LessonCaseListBySubject(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &LessonCaseListBySubjectRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	roles, ok := context.Locals("roles").([]int)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	lessonCaseListBySubjectOutput, err := api.Service.LessonCaseListBySubject(&LessonCaseListBySubjectInput{
		Roles:                          roles,
		UserId:                         userId,
		LessonCaseListBySubjectRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LessonCaseListBySubjectResponse{
		StatusCode: http.StatusOK,
		Data:       lessonCaseListBySubjectOutput.Lessons,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type LessonCaseListBySubjectInput struct {
	Roles  []int
	UserId string
	*LessonCaseListBySubjectRequest
}

type LessonCaseListBySubjectOutput struct {
	Lessons []constant.LessonDataEntity
}

func (service *serviceStruct) LessonCaseListBySubject(in *LessonCaseListBySubjectInput) (*LessonCaseListBySubjectOutput, error) {
	curriculumGroupId, err := service.academicLevelStorage.SubjectCaseGetCurriculumGroupId(in.SubjectId)
	if err != nil {
		return nil, err
	}

	err = service.CheckContentCreator(&CheckContentCreatorInput{
		SubjectId:         in.UserId,
		Roles:             in.Roles,
		CurriculumGroupId: *curriculumGroupId,
	})
	if err != nil {
		return nil, err
	}

	lessons, err := service.academicLevelStorage.LessonCaseListBySubject(in.SubjectId)
	if err != nil {
		return nil, err
	}

	return &LessonCaseListBySubjectOutput{
		Lessons: lessons,
	}, nil
}
