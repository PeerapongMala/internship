package service

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/jinzhu/copier"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type QuestionLearnUpdateRequest struct {
	EnforceDescriptionLanguage *bool   `form:"enforce_description_language" validate:"required"`
	EnforceChoiceLanguage      *bool   `form:"enforce_choice_language" validate:"required"`
	CommandTextId              *string `form:"command_text_id"`
	Text                       *string `form:"text"`
	Url                        *string `form:"url"`
}

// ==================== Response ==========================

type QuestionLearnUpdateResponse struct {
	StatusCode int           `json:"status_code"`
	Data       []interface{} `json:"data"`
	Message    string        `json:"message"`
}

func (api *APIStruct) QuestionLearnUpdate(context *fiber.Ctx) error {
	questionId, err := context.ParamsInt("questionId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	request, err := helper.ParseAndValidateRequest(context, &QuestionLearnUpdateRequest{})
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

	questionLearnUpdateOutput, err := api.Service.QuestionLearnUpdate(&QuestionLearnUpdateInput{
		Roles:                      roles,
		SubjectId:                  subjectId,
		QuestionId:                 questionId,
		QuestionLearnUpdateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(QuestionLearnUpdateResponse{
		StatusCode: http.StatusOK,
		Data:       []interface{}{questionLearnUpdateOutput.QuestionLearn},
		Message:    "Question updated",
	})
}

// ==================== Service ==========================

type QuestionLearnUpdateInput struct {
	Roles      []int
	SubjectId  string
	QuestionId int
	*QuestionLearnUpdateRequest
}

type QuestionLearnUpdateOutput struct {
	QuestionLearn interface{}
}

func (service *serviceStruct) QuestionLearnUpdate(in *QuestionLearnUpdateInput) (*QuestionLearnUpdateOutput, error) {
	curriculumGroupId, err := service.academicLevelStorage.QuestionCaseGetCurriculumGroupId(in.QuestionId)
	if err != nil {
		return nil, err
	}

	err = service.CheckContentCreator(&CheckContentCreatorInput{
		SubjectId:         in.SubjectId,
		Roles:             in.Roles,
		CurriculumGroupId: *curriculumGroupId,
	})
	if err != nil {
		return nil, err
	}

	question, err := service.academicLevelStorage.QuestionGet(in.QuestionId)
	if err != nil {
		return nil, err
	}

	tx, err := service.academicLevelStorage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	keysToDelete := []string{}

	questionEntity := constant.QuestionEntity{}
	err = copier.Copy(&questionEntity, in.QuestionLearnUpdateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	questionEntity.Id = in.QuestionId

	updateQuestionOutput, err := service.UpdateQuestion(&UpdateQuestionInput{
		Tx:       tx,
		Question: questionEntity,
	})
	if err != nil {
		return nil, err
	}
	keysToDelete = append(keysToDelete, updateQuestionOutput.KeysToDelete...)

	questionLearnEntity := constant.QuestionLearnEntity{}
	err = copier.Copy(&questionLearnEntity, in.QuestionLearnUpdateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	questionLearnEntity.QuestionId = in.QuestionId

	_, err = service.academicLevelStorage.QuestionLearnUpdate(tx, &questionLearnEntity)
	if err != nil {
		return nil, err
	}

	if in.CommandTextId != nil {
		updateQuestionTextOutput, err := service.UpdateQuestionText(&UpdateQuestionTextInput{
			Tx:         tx,
			QuestionId: in.QuestionId,
			TextMap: map[string]*string{
				constant.Command: in.CommandTextId,
			},
		})
		if err != nil {
			return nil, err
		}
		keysToDelete = append(keysToDelete, updateQuestionTextOutput.KeysToDelete...)
	}

	level, err := service.academicLevelStorage.LevelGet(question.LevelId)
	if err != nil {
		return nil, err
	}

	err = service.academicLevelStorage.SubLessonFileStatusTxUpdate(tx, []int{level.SubLessonId}, false, in.SubjectId)
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	for _, key := range keysToDelete {
		err := service.cloudStorage.ObjectDelete(key)
		if err != nil {
			return nil, err
		}
	}

	getFullQuestionLearnOutput, err := service.GetFullQuestionLearn(&GetFullQuestionLearnInput{
		constant.QuestionEntity{
			Id: question.Id,
		},
	})
	if err != nil {
		return nil, err
	}

	return &QuestionLearnUpdateOutput{
		getFullQuestionLearnOutput.FullQuestionLearn,
	}, nil
}
