package service

import (
	"database/sql"
	"log"
	"net/http"
	"slices"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/jinzhu/copier"
	"github.com/pkg/errors"
)

// ==================== Request ===========================

type LevelUpdateRequest struct {
	LevelId             int     `params:"levelId" validate:"required"`
	SubLessonId         int     `json:"sub_lesson_id"`
	BloomType           int     `json:"bloom_type"`
	TagIds              []int   `json:"tag_ids"`
	SubCriteriaTopicIds []int   `json:"sub_criteria_topic_ids"`
	Password            string  `json:"password"`
	LevelType           string  `json:"level_type"`
	Difficulty          string  `json:"difficulty"`
	LockNextLevel       *bool   `json:"lock_next_level"`
	TimerType           string  `json:"timer_type"`
	TimerTime           *int    `json:"timer_time"`
	Status              string  `json:"status"`
	WizardIndex         int     `json:"wizard_index"`
	AdminLoginAs        *string `json:"admin_login_as"`
}

// ==================== Response ==========================

type LevelUpdateResponse struct {
	StatusCode int                            `json:"status_code"`
	Data       []*constant.LevelGetDataEntity `json:"data"`
	Message    string                         `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LevelUpdate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &LevelUpdateRequest{}, helper.ParseOptions{Body: true, Params: true})
	if err != nil {
		return helper.RespondHttpError(context, err)
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

	levelUpdateOutput, err := api.Service.LevelUpdate(&LevelUpdateInput{
		Roles:              roles,
		SubjectId:          subjectId,
		LevelUpdateRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LevelUpdateResponse{
		StatusCode: http.StatusOK,
		Data:       []*constant.LevelGetDataEntity{levelUpdateOutput.LevelGetDataEntity},
		Message:    "Level updated",
	})
}

// ==================== Service ==========================

type LevelUpdateInput struct {
	Roles     []int
	SubjectId string
	*LevelUpdateRequest
}

type LevelUpdateOutput struct {
	*constant.LevelGetDataEntity
}

func (service *serviceStruct) LevelUpdate(in *LevelUpdateInput) (*LevelUpdateOutput, error) {
	level, err := service.academicLevelStorage.LevelGet(in.LevelId)
	if err != nil {
		return nil, err
	}

	curriculumGroupId, err := service.academicLevelStorage.SubLessonCaseGetCurriculumGroupId(level.SubLessonId)
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

	err = constant.ValidateNewStatus(level.Status, in.Status)
	if err != nil {
		return nil, err
	}

	tx, err := service.academicLevelStorage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	levelEntity := constant.LevelUpdateEntity{}
	err = copier.Copy(&levelEntity, in.LevelUpdateRequest)
	levelEntity.Id = in.LevelId
	levelEntity.Index = level.Index
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	now := time.Now().UTC()
	levelEntity.Status = in.Status
	levelEntity.UpdatedAt = &now
	levelEntity.UpdatedBy = &in.SubjectId
	levelEntity.AdminLoginAs = in.AdminLoginAs
	_, err = service.academicLevelStorage.LevelUpdate(tx, &levelEntity)
	if err != nil {
		return nil, err
	}

	keysToDelete := []string{}
	if !slices.Contains([]string{constant.Enabled, constant.Disabled}, level.Status) && in.Status == constant.Disabled {
		authEmailPassword, err := service.academicLevelStorage.AuthEmailPasswordGet(in.SubjectId)
		if err != nil {
			return nil, err
		}

		isMatched := helper.ValidatePassword(authEmailPassword.PasswordHash, in.Password)
		if !isMatched {
			return nil, helper.NewHttpError(http.StatusForbidden, nil)
		}

		deleteLevelsOutput, err := service.DeleteLevels(&DeleteLevelsInput{
			Tx: tx,
			Levels: []constant.LevelEntity{{
				Id:          levelEntity.Id,
				SubLessonId: levelEntity.SubLessonId,
				Index:       levelEntity.Index,
			}},
		})
		if err != nil {
			return nil, err
		}
		keysToDelete = append(keysToDelete, deleteLevelsOutput.KeysToDelete...)

	} else if level.Status != constant.Disabled &&
		((in.SubLessonId != 0 && level.SubLessonId != in.SubLessonId) || in.Status == constant.Disabled) { // case change level to another sub-lesson & disable when published
		err = service.ShiftLevel(&ShiftLevelsInput{
			Tx:          tx,
			SubLessonId: levelEntity.SubLessonId,
			Index:       levelEntity.Index,
		})
		if err != nil {
			return nil, err
		}

		// change level to other sub-lesson
		if in.SubLessonId != 0 && level.SubLessonId != in.SubLessonId {
			levelEntity.SubLessonId = in.SubLessonId
			lastLevelIndex, err := service.academicLevelStorage.SubLessonCaseGetLastLevelIndex(in.SubLessonId)
			if err != nil {
				return nil, err
			}
			levelEntity.Index = *lastLevelIndex + 1
		}

		_, err = service.academicLevelStorage.LevelUpdate(tx, &levelEntity)
		if err != nil {
			return nil, err
		}
	}

	if in.Status == constant.Enabled {
		err = service.academicLevelStorage.LevelCaseAutoSort(tx, level.SubLessonId)
		if err != nil {
			return nil, err
		}
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

	err = service.cloudStorage.ObjectCaseBatchDelete(keysToDelete)
	if err != nil {
		return nil, err
	}

	updatedLevel, err := service.academicLevelStorage.LevelGet(in.LevelId)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return nil, err
	}

	return &LevelUpdateOutput{
		updatedLevel,
	}, nil
}
