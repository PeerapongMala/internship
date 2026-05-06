package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d05-teacher-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

// ==================== Request ==========================

type LevelCaseListUnlockedStudyGroupRequest struct {
	ClassId int `params:"classId" validate:"required"`
	LevelId int `params:"levelId" validate:"required"`
}

// ==================== Response ==========================

type LevelCaseListUnlockedStudyGroupResponse struct {
	StatusCode int                                         `json:"status_code"`
	Pagination *helper.Pagination                          `json:"_pagination"`
	Data       []constant.LevelUnlockedForStudyGroupEntity `json:"data"`
	Message    string                                      `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LevelCaseListUnlockedStudyGroup(context *fiber.Ctx) error {
	pagination := helper.PaginationNew(context)

	request, err := helper.ParseAndValidateRequest(context, &LevelCaseListUnlockedStudyGroupRequest{}, helper.ParseOptions{Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	levelCaseListUnlockedStudyGroupOutput, err := api.Service.LevelCaseListUnlockedStudyGroup(&LevelCaseListUnlockedStudyGroupInput{
		Pagination:                             pagination,
		SubjectId:                              subjectId,
		LevelCaseListUnlockedStudyGroupRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LevelCaseListUnlockedStudyGroupResponse{
		StatusCode: http.StatusOK,
		Pagination: pagination,
		Data:       levelCaseListUnlockedStudyGroupOutput.LevelUnlockedForStudyGroup,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type LevelCaseListUnlockedStudyGroupInput struct {
	Pagination *helper.Pagination
	SubjectId  string
	*LevelCaseListUnlockedStudyGroupRequest
}

type LevelCaseListUnlockedStudyGroupOutput struct {
	LevelUnlockedForStudyGroup []constant.LevelUnlockedForStudyGroupEntity
}

func (service *serviceStruct) LevelCaseListUnlockedStudyGroup(in *LevelCaseListUnlockedStudyGroupInput) (*LevelCaseListUnlockedStudyGroupOutput, error) {
	err := service.ValidateTeacherClass(&ValidateTeacherClassInput{
		ClassId:   in.ClassId,
		SubjectId: in.SubjectId,
	})
	if err != nil {
		return nil, err
	}

	levelUnlockedForStudyGroup, err := service.teacherLessonStorage.LevelCaseListUnlockedStudyGroup(in.ClassId, in.LevelId, in.Pagination)
	if err != nil {
		return nil, err
	}

	return &LevelCaseListUnlockedStudyGroupOutput{levelUnlockedForStudyGroup}, nil
}
