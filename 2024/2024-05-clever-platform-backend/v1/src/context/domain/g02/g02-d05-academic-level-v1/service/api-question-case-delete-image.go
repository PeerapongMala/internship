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

type QuestionCaseDeleteImageRequest struct {
	QuestionId int    `params:"questionId" validate:"required"`
	ImageType  string `json:"image_type"  validate:"required"`
}

// ==================== Response ==========================

type QuestionCaseDeleteImageResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) QuestionCaseDeleteImage(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &QuestionCaseDeleteImageRequest{}, helper.ParseOptions{Params: true, Body: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	roles, ok := context.Locals("roles").([]int)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	err = api.Service.QuestionCaseDeleteImage(&QuestionCaseDeleteImageInput{
		Roles:                          roles,
		SubjectId:                      subjectId,
		QuestionCaseDeleteImageRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(QuestionCaseDeleteImageResponse{
		StatusCode: http.StatusOK,
		Message:    "Image deleted",
	})
}

// ==================== Service ==========================

type QuestionCaseDeleteImageInput struct {
	Roles     []int
	SubjectId string
	*QuestionCaseDeleteImageRequest
}

func (service *serviceStruct) QuestionCaseDeleteImage(in *QuestionCaseDeleteImageInput) error {
	curriculumGroupId, err := service.academicLevelStorage.QuestionCaseGetCurriculumGroupId(in.QuestionId)
	if err != nil {
		return err
	}

	err = service.CheckContentCreator(&CheckContentCreatorInput{
		SubjectId:         in.SubjectId,
		Roles:             in.Roles,
		CurriculumGroupId: *curriculumGroupId,
	})
	if err != nil {
		return err
	}

	question, err := service.academicLevelStorage.QuestionGet(in.QuestionId)
	if err != nil {
		return err
	}

	tx, err := service.academicLevelStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	isUpdated := false
	var keyToDelete *string
	if in.ImageType == constant.QuestionDescriptionImage && question.ImageDescriptionUrl != nil {
		keyToDelete = question.ImageDescriptionUrl
		question.ImageDescriptionUrl = nil
		isUpdated = true
	}
	if in.ImageType == constant.QuestionHintImage && question.ImageHintUrl != nil {
		keyToDelete = question.ImageHintUrl
		question.ImageHintUrl = nil
		isUpdated = true
	}
	if isUpdated {
		_, err := service.academicLevelStorage.QuestionUpdate(tx, question)
		if err != nil {
			return err
		}
	}

	level, err := service.academicLevelStorage.LevelGet(question.LevelId)
	if err != nil {
		return err
	}

	err = service.academicLevelStorage.SubLessonFileStatusTxUpdate(tx, []int{level.SubLessonId}, false, in.SubjectId)
	if err != nil {
		return err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	if keyToDelete != nil {
		err := service.cloudStorage.ObjectDelete(*keyToDelete)
		if err != nil {
			return err
		}
	}

	return nil
}
