package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"slices"
)

// ==================== Service ==========================

type DeleteLevelsInput struct {
	Tx     *sqlx.Tx
	Levels []constant.LevelEntity
}

type DeleteLevelsOutput struct {
	KeysToDelete []string
}

func (service *serviceStruct) DeleteLevels(in *DeleteLevelsInput) (*DeleteLevelsOutput, error) {
	keysToDelete := []string{}
	levelIds := []int{}
	questions := []constant.QuestionEntity{}
	for _, level := range in.Levels {
		q, err := service.academicLevelStorage.QuestionCaseListByLevelId(level.Id, nil)
		if err != nil {
			return nil, err
		}

		questions = append(questions, q...)

		if !slices.Contains(levelIds, level.Id) {
			levelIds = append(levelIds, level.Id)
		}

		err = service.ShiftLevel(&ShiftLevelsInput{
			Tx:          in.Tx,
			SubLessonId: level.SubLessonId,
			Index:       level.Index,
		})
		if err != nil {
			return nil, err
		}
	}

	deleteQuestionsOutput, err := service.DeleteQuestions(&DeleteQuestionsInput{
		Tx:        in.Tx,
		Questions: questions,
	})
	if err != nil {
		return nil, err
	}
	keysToDelete = append(keysToDelete, deleteQuestionsOutput.KeysToDelete...)

	err = service.academicLevelStorage.TagCaseDeleteByLevelId(in.Tx, levelIds)
	if err != nil {
		return nil, err
	}

	err = service.academicLevelStorage.SubCriteriaTopicCaseDeleteByLevelId(in.Tx, levelIds)
	if err != nil {
		return nil, err
	}

	err = service.academicLevelStorage.LevelSpecialRewardDelete(in.Tx, levelIds)
	if err != nil {
		return nil, err
	}

	err = service.academicLevelStorage.LevelDelete(in.Tx, levelIds)
	if err != nil {
		return nil, err
	}
	return &DeleteLevelsOutput{
		keysToDelete,
	}, nil
}
