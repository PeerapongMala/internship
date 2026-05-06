package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
)

// ==================== Service ==========================

type DeleteQuestionsInput struct {
	Tx        *sqlx.Tx
	Questions []constant.QuestionEntity
}

type DeleteQuestionsOutput struct {
	KeysToDelete []string
}

func (service *serviceStruct) DeleteQuestions(in *DeleteQuestionsInput) (*DeleteQuestionsOutput, error) {
	keysToDelete := []string{}
	questionIds := []int{}
	for _, question := range in.Questions {
		if question.ImageDescriptionUrl != nil {
			keysToDelete = append(keysToDelete, *question.ImageDescriptionUrl)
		}
		if question.ImageHintUrl != nil {
			keysToDelete = append(keysToDelete, *question.ImageHintUrl)
		}
		questionIds = append(questionIds, question.Id)
	}

	// multiple choices
	err := service.academicLevelStorage.QuestionMultipleChoiceTextChoiceCaseDeleteAll(in.Tx, questionIds...)
	if err != nil {
		return nil, err
	}

	imageKeys, err := service.academicLevelStorage.QuestionMultipleChoiceImageChoiceCaseDeleteAll(in.Tx, questionIds...)
	if err != nil {
		return nil, err
	}
	keysToDelete = append(keysToDelete, imageKeys...)

	err = service.academicLevelStorage.QuestionMultipleChoiceDelete(in.Tx, questionIds...)
	if err != nil {
		return nil, err
	}

	// sort
	err = service.academicLevelStorage.QuestionSortAnswerCaseDeleteByQuestionId(in.Tx, questionIds...)
	if err != nil {
		return nil, err
	}

	err = service.academicLevelStorage.QuestionSortTextChoiceCaseDeleteByQuestionId(in.Tx, questionIds...)
	if err != nil {
		return nil, err
	}

	err = service.academicLevelStorage.QuestionSortDelete(in.Tx, questionIds...)
	if err != nil {
		return nil, err
	}

	// group
	err = service.academicLevelStorage.QuestionGroupGroupMemberCaseDeleteByQuestionId(in.Tx, questionIds...)
	if err != nil {
		return nil, err
	}

	imageKeys, err = service.academicLevelStorage.QuestionGroupChoiceCaseDeleteByQuestionId(in.Tx, questionIds...)
	if err != nil {
		return nil, err
	}
	keysToDelete = append(keysToDelete, imageKeys...)

	err = service.academicLevelStorage.QuestionGroupGroupCaseDeleteByQuestionId(in.Tx, questionIds...)
	if err != nil {
		return nil, err
	}

	err = service.academicLevelStorage.QuestionGroupDelete(in.Tx, questionIds...)
	if err != nil {
		return nil, err
	}

	// placeholder
	err = service.academicLevelStorage.QuestionPlaceholderTextChoiceCaseDeleteByQuestion(in.Tx, questionIds...)
	if err != nil {
		return nil, err
	}

	speechKeys, err := service.academicLevelStorage.QuestionPlaceholderCaseDeleteDescription(in.Tx, questionIds...)
	if err != nil {
		return nil, err
	}
	keysToDelete = append(keysToDelete, speechKeys...)

	err = service.academicLevelStorage.QuestionPlaceholderDelete(in.Tx, questionIds...)
	if err != nil {
		return nil, err
	}

	// input
	speechKeys, err = service.academicLevelStorage.QuestionInputCaseDeleteDescription(in.Tx, questionIds...)
	if err != nil {
		return nil, err
	}
	keysToDelete = append(keysToDelete, speechKeys...)

	err = service.academicLevelStorage.QuestionInputDelete(in.Tx, questionIds...)
	if err != nil {
		return nil, err
	}

	// learn
	err = service.academicLevelStorage.QuestionLearnDelete(in.Tx, questionIds...)
	if err != nil {
		return nil, err
	}

	speechKeys, err = service.academicLevelStorage.QuestionTextCaseDeleteByQuestionId(in.Tx, questionIds...)
	if err != nil {
		return nil, err
	}
	keysToDelete = append(keysToDelete, speechKeys...)

	err = service.academicLevelStorage.QuestionDelete(in.Tx, questionIds...)
	if err != nil {
		return nil, err
	}

	return &DeleteQuestionsOutput{
		KeysToDelete: keysToDelete,
	}, nil
}
