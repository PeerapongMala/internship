package service

import (
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

// ==================== Request ==========================

type LevelCaseBulkEditRequest struct {
	Password     string                       `json:"password" validate:"required"`
	BulkEditList []constant.LevelBulkEditItem `json:"bulk_edit_list" validate:"required"`
	AdminLoginAs *string                      `json:"admin_login_as"`
}

// ==================== Response ==========================

type LevelCaseBulkEditResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) LevelCaseBulkEdit(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &LevelCaseBulkEditRequest{})
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

	err = api.Service.LevelCaseBulkEdit(&LevelCaseBulkEditInput{
		Roles:                    roles,
		SubjectId:                subjectId,
		LevelCaseBulkEditRequest: request,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LevelCaseBulkEditResponse{
		StatusCode: http.StatusOK,
		Message:    "Edited",
	})
}

// ==================== Service ==========================

type LevelCaseBulkEditInput struct {
	Roles     []int
	SubjectId string
	*LevelCaseBulkEditRequest
}

func (service *serviceStruct) LevelCaseBulkEdit(in *LevelCaseBulkEditInput) error {
	start := time.Now()
	authEmailPassword, err := service.academicLevelStorage.AuthEmailPasswordGet(in.SubjectId)
	if err != nil {
		return err
	}

	isMatched := helper.ValidatePassword(authEmailPassword.PasswordHash, in.Password)
	if !isMatched {
		return helper.NewHttpError(http.StatusForbidden, nil)
	}

	levels := map[int]constant.LevelUpdateEntity{}
	currentLevels := map[int]constant.LevelGetDataEntity{}
	for _, bulkEditItem := range in.BulkEditList {
		curriculumGroupId, err := service.academicLevelStorage.LevelCaseGetCurriculumGroupId(bulkEditItem.LevelId)
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

		level, err := service.academicLevelStorage.LevelGet(bulkEditItem.LevelId)
		if err != nil {
			return err
		}
		currentLevels[level.Id] = helper.Deref(level)
		levelUpdateEntity := constant.LevelUpdateEntity{}
		err = copier.Copy(&levelUpdateEntity, level)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
		now := time.Now().UTC()
		levelUpdateEntity.Status = bulkEditItem.Status
		levelUpdateEntity.UpdatedAt = &now
		levelUpdateEntity.UpdatedBy = &in.SubjectId
		levelUpdateEntity.AdminLoginAs = in.AdminLoginAs
		levels[level.Id] = levelUpdateEntity
		//_, err = service.academicLevelStorage.LevelUpdate(tx, &levelUpdateEntity)
		//if err != nil {
		//	return err
		//}
	}

	tx, err := service.academicLevelStorage.BeginTx()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	keysToDelete := []string{}
	subLessonIds := []int{}
	levelsToDelete := []constant.LevelEntity{}
	for _, bulkEditItem := range in.BulkEditList {
		level := currentLevels[bulkEditItem.LevelId]
		if !slices.Contains([]string{constant.Enabled, constant.Disabled}, level.Status) && bulkEditItem.Status == constant.Disabled {
			levelsToDelete = append(levelsToDelete, constant.LevelEntity{
				Id:          level.Id,
				SubLessonId: level.SubLessonId,
				Index:       level.Index,
			})
			//deleteLevelsOutput, err := service.DeleteLevels(&DeleteLevelsInput{
			//	Tx: tx,
			//	Levels: []constant.LevelEntity{{
			//	}},
			//})
			//if err != nil {
			//	return err
			//}
			//keysToDelete = append(keysToDelete, deleteLevelsOutput.KeysToDelete...)
		}

		if !slices.Contains(subLessonIds, level.SubLessonId) {
			subLessonIds = append(subLessonIds, level.SubLessonId)
		}
	}

	deleteLevelsOutput, err := service.DeleteLevels(&DeleteLevelsInput{
		Tx:     tx,
		Levels: levelsToDelete,
	})
	if err != nil {
		return err
	}
	keysToDelete = append(keysToDelete, deleteLevelsOutput.KeysToDelete...)

	err = service.academicLevelStorage.SubLessonFileStatusTxUpdate(tx, subLessonIds, false, in.SubjectId)
	if err != nil {
		return err
	}

	err = service.academicLevelStorage.LevelCaseBulkUpdate(tx, levels)
	if err != nil {
		return err
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	err = service.cloudStorage.ObjectCaseBatchDelete(keysToDelete)
	if err != nil {
		return err
	}
	log.Println(time.Since(start))

	return nil
}
