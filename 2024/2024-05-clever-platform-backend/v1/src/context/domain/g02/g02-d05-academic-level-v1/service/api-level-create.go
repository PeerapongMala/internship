package service

import (
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/jinzhu/copier"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

type LevelCreateRequest struct {
	SubLessonId         int     `json:"sub_lesson_id" validate:"required"`
	BloomType           int     `json:"bloom_type" validate:"required"`
	SubCriteriaTopicIds []int   `json:"sub_criteria_topic_ids"`
	TagIds              []int   `json:"tag_ids"`
	QuestionType        string  `json:"question_type" validate:"required"`
	LevelType           string  `json:"level_type" validate:"required"`
	Difficulty          string  `json:"difficulty" validate:"required"`
	LockNextLevel       *bool   `json:"lock_next_level" validate:"required"`
	TimerType           string  `json:"timer_type" validate:"required"`
	TimerTime           int     `json:"timer_time"`
	Status              string  `json:"status" validate:"required"`
	WizardIndex         int     `json:"wizard_index" validate:"required"`
	AdminLoginAs        *string `json:"admin_login_as"`
}

// ==================== Response ==========================

type LevelCreateResponse struct {
	StatusCode int                    `json:"status_code"`
	Data       []constant.LevelEntity `json:"data"`
	Message    string                 `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LevelCreate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &LevelCreateRequest{})
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	err = constant.ValidateStatus(request.Status)
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

	levelCreateOutput, err := api.Service.LevelCreate(&LevelCreateInput{
		Roles:              roles,
		SubjectId:          subjectId,
		LevelCreateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusCreated).JSON(LevelCreateResponse{
		StatusCode: http.StatusCreated,
		Data:       []constant.LevelEntity{*levelCreateOutput.LevelEntity},
		Message:    "Level created",
	})
}

// ==================== Service ==========================

type LevelCreateInput struct {
	Roles     []int
	SubjectId string
	*LevelCreateRequest
}

type LevelCreateOutput struct {
	*constant.LevelEntity
}

func (service *serviceStruct) LevelCreate(in *LevelCreateInput) (*LevelCreateOutput, error) {
	curriculumGroupId, err := service.academicLevelStorage.SubLessonCaseGetCurriculumGroupId(in.SubLessonId)
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

	lastLevelIndex, err := service.academicLevelStorage.SubLessonCaseGetLastLevelIndex(in.SubLessonId)
	if err != nil {
		return nil, err
	}

	levelEntity := constant.LevelEntity{}
	err = copier.Copy(&levelEntity, in.LevelCreateRequest)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	levelEntity.CreatedAt = time.Now().UTC()
	levelEntity.CreatedBy = in.SubjectId
	levelEntity.Index = *lastLevelIndex + 1

	tx, err := service.academicLevelStorage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	level, err := service.academicLevelStorage.LevelCreate(tx, &levelEntity)
	if err != nil {
		return nil, err
	}

	err = service.academicLevelStorage.SubLessonFileStatusTxUpdate(tx, []int{in.SubLessonId}, false, in.SubjectId)
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &LevelCreateOutput{
		LevelEntity: level,
	}, nil
}
