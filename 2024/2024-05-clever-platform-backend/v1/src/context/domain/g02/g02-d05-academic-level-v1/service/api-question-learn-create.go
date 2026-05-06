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

type QuestionLearnCreateRequest struct {
	LevelId                    int     `form:"level_id" validate:"required"`
	QuestionType               string  `form:"question_type" validate:"required"`
	EnforceDescriptionLanguage *bool   `form:"enforce_description_language" validate:"required"`
	EnforceChoiceLanguage      *bool   `form:"enforce_choice_language" validate:"required"`
	CommandTextId              string  `form:"command_text_id"`
	Text                       *string `form:"text"`
	Url                        *string `form:"url"`
}

// ==================== Response ==========================

type QuestionLearnCreateResponse struct {
	StatusCode int           `json:"status_code"`
	Data       []interface{} `json:"data"`
	Message    string        `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) QuestionLearnCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &QuestionLearnCreateRequest{})
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

	questionLearnCreateOutput, err := api.Service.QuestionLearnCreate(&QuestionLearnCreateInput{
		Roles:                      roles,
		SubjectId:                  subjectId,
		QuestionLearnCreateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(QuestionLearnCreateResponse{
		StatusCode: http.StatusCreated,
		Data:       []interface{}{questionLearnCreateOutput.QuestionLearn},
		Message:    "Question created",
	})
}

// ==================== Service ==========================

type QuestionLearnCreateInput struct {
	Roles     []int
	SubjectId string
	*QuestionLearnCreateRequest
}

type QuestionLearnCreateOutput struct {
	QuestionLearn interface{}
}

func (service *serviceStruct) QuestionLearnCreate(in *QuestionLearnCreateInput) (*QuestionLearnCreateOutput, error) {
	curriculumGroupId, err := service.academicLevelStorage.LevelCaseGetCurriculumGroupId(in.LevelId)
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

	tx, err := service.academicLevelStorage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	question := constant.QuestionEntity{}
	err = copier.Copy(&question, in.QuestionLearnCreateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	createQuestionOutput, err := service.CreateQuestion(&CreateQuestionInput{
		Tx:       tx,
		LevelId:  in.LevelId,
		Question: question,
	})
	if err != nil {
		return nil, err
	}
	question = createQuestionOutput.Question

	err = service.CreateQuestionText(&CreateQuestionTextInput{
		Tx:         tx,
		QuestionId: question.Id,
		TextMap: map[string]*string{
			constant.Command: &in.CommandTextId,
		},
	})
	if err != nil {
		return nil, err
	}

	questionLearnEntity := constant.QuestionLearnEntity{}
	err = copier.Copy(&questionLearnEntity, in.QuestionLearnCreateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	questionLearnEntity.QuestionId = question.Id

	_, err = service.academicLevelStorage.QuestionLearnCreate(tx, &questionLearnEntity)
	if err != nil {
		return nil, err
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

	getFullQuestionLearnOutput, err := service.GetFullQuestionLearn(&GetFullQuestionLearnInput{
		constant.QuestionEntity{Id: question.Id},
	})
	if err != nil {
		return nil, err
	}

	return &QuestionLearnCreateOutput{
		getFullQuestionLearnOutput.FullQuestionLearn,
	}, nil
}
