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
type QuestionDeleteRequest struct {
	QuestionId int    `params:"questionId" validate:"required"`
	Password   string `json:"password" validate:"required"`
}

// ==================== Response ==========================

type QuestionDeleteResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) QuestionDelete(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &QuestionDeleteRequest{}, helper.ParseOptions{Params: true, Body: true})
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

	err = api.Service.QuestionDelete(&QuestionDeleteInput{
		SubjectId:             subjectId,
		Roles:                 roles,
		QuestionDeleteRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(QuestionDeleteResponse{
		StatusCode: http.StatusOK,
		Message:    "Question deleted",
	})
}

// ==================== Service ==========================

type QuestionDeleteInput struct {
	SubjectId string
	Roles     []int
	*QuestionDeleteRequest
}

func (service *serviceStruct) QuestionDelete(in *QuestionDeleteInput) error {
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

	authEmailPassword, err := service.academicLevelStorage.AuthEmailPasswordGet(in.SubjectId)
	if err != nil {
		return err
	}

	isMatched := helper.ValidatePassword(authEmailPassword.PasswordHash, in.Password)
	if !isMatched {
		return helper.NewHttpError(http.StatusForbidden, nil)
	}

	tx, err := service.academicLevelStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	keysToDelete := []string{}

	question, err := service.academicLevelStorage.QuestionGet(in.QuestionId)
	if err != nil {
		return err
	}

	deleteQuestionsOutput, err := service.DeleteQuestions(&DeleteQuestionsInput{
		Tx:        tx,
		Questions: []constant.QuestionEntity{*question},
	})
	if err != nil {
		return err
	}
	keysToDelete = append(keysToDelete, deleteQuestionsOutput.KeysToDelete...)

	questions, err := service.academicLevelStorage.QuestionCaseGetQuestionToShift(question.LevelId, question.Index)
	if err != nil {
		return err
	}

	for _, question := range questions {
		question.Index--
		_, err := service.academicLevelStorage.QuestionUpdate(tx, &question)
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

	for _, key := range keysToDelete {
		err := service.cloudStorage.ObjectDelete(key)
		if err != nil {
			return err
		}
	}

	return nil
}
