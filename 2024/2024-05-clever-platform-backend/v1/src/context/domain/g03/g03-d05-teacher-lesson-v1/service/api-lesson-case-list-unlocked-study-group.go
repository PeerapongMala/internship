package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d05-teacher-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type LessonCaseListUnlockedStudyGroupRequest struct {
	ClassId  int `params:"classId" validate:"required"`
	LessonId int `params:"lessonId" validate:"required"`
}

// ==================== Response ==========================

type LessonCaseListUnlockedStudyGroupResponse struct {
	StatusCode int                                         `json:"status_code"`
	Pagination *helper.Pagination                          `json:"_pagination"`
	Data       []constant.LevelUnlockedForStudyGroupEntity `json:"data"`
	Message    string                                      `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LessonCaseListUnlockedStudyGroup(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	request, err := helper.ParseAndValidateRequest(context, &LessonCaseListUnlockedStudyGroupRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	lessonCaseListUnlockedStudyGroupOutput, err := api.Service.LessonCaseListUnlockedStudyGroup(&LessonCaseListUnlockedStudyGroupInput{
		Pagination:                              pagination,
		SubjectId:                               subjectId,
		LessonCaseListUnlockedStudyGroupRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LessonCaseListUnlockedStudyGroupResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       lessonCaseListUnlockedStudyGroupOutput.LevelUnlockedForStudyGroup,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type LessonCaseListUnlockedStudyGroupInput struct {
	Pagination *helper.Pagination
	SubjectId  string
	*LessonCaseListUnlockedStudyGroupRequest
}

type LessonCaseListUnlockedStudyGroupOutput struct {
	LevelUnlockedForStudyGroup []constant.LevelUnlockedForStudyGroupEntity
}

func (service *serviceStruct) LessonCaseListUnlockedStudyGroup(in *LessonCaseListUnlockedStudyGroupInput) (*LessonCaseListUnlockedStudyGroupOutput, error) {
	err := service.ValidateTeacherClass(&ValidateTeacherClassInput{
		ClassId:   in.ClassId,
		SubjectId: in.SubjectId,
	})
	if err != nil {
		return nil, err
	}

	lessonUnlockedForStudyGroup, err := service.teacherLessonStorage.LessonCaseListUnlockedStudyGroup(in.ClassId, in.LessonId, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &LessonCaseListUnlockedStudyGroupOutput{lessonUnlockedForStudyGroup}, nil
}
