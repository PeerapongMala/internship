package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d05-teacher-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"net/http"
	"time"
)

// ==================== Request ==========================

type LevelUnlockedForStudyGroupCreateRequest struct {
	LevelId       int     `params:"levelId" validate:"required"`
	StudyGroupIds []int   `json:"study_group_ids" validate:"required"`
	AdminLoginAs  *string `json:"admin_login_as"`
}

// ==================== Response ==========================

type LevelUnlockedForStudyGroupCreateResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LevelUnlockedForStudyGroupCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &LevelUnlockedForStudyGroupCreateRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.LevelUnlockedForStudyGroupCreate(&LevelUnlockedForStudyGroupCreateInput{
		SubjectId:                               subjectId,
		LevelUnlockedForStudyGroupCreateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(LevelUnlockedForStudyGroupCreateResponse{
		StatusCode: http.StatusCreated,
		Message:    "Study group added",
	})
}

// ==================== Service ==========================

type LevelUnlockedForStudyGroupCreateInput struct {
	SubjectId string
	*LevelUnlockedForStudyGroupCreateRequest
}

func (service *serviceStruct) LevelUnlockedForStudyGroupCreate(in *LevelUnlockedForStudyGroupCreateInput) error {
	levelUnlockedForStudyGroupList := []constant.LevelUnlockedForStudyGroup{}
	for _, studyGroupId := range in.StudyGroupIds {
		levelUnlockedForStudyGroupList = append(levelUnlockedForStudyGroupList, constant.LevelUnlockedForStudyGroup{
			LevelId:      in.LevelId,
			StudyGroupId: studyGroupId,
			CreatedAt:    time.Now().UTC(),
			CreatedBy:    in.SubjectId,
			AdminLoginAs: in.AdminLoginAs,
		})
	}

	err := service.teacherLessonStorage.LevelUnlockedForStudyGroupCreate(levelUnlockedForStudyGroupList)
	if err != nil {
		return err
	}

	return nil
}
