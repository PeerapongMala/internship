package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

// ==================== Service ==========================

type UpdateQuestionGroupGroupsInput struct {
	Tx         *sqlx.Tx
	QuestionId int
	Groups     []constant.QuestionGroupGroupEntity
}

func (service *serviceStruct) UpdateQuestionGroupGroups(in *UpdateQuestionGroupGroupsInput) error {
	// groups
	if in.Groups != nil {
		groups, err := service.academicLevelStorage.QuestionGroupGroupCaseListByQuestion(in.Tx, in.QuestionId)
		if err != nil {
			return err
		}

		for _, group := range groups {
			err := service.academicLevelStorage.QuestionGroupGroupMemberCaseDeleteByQuestionGroupGroupId(in.Tx, group.Id)
			if err != nil {
				return err
			}
		}

		err = service.academicLevelStorage.QuestionGroupGroupCaseDeleteByQuestionId(in.Tx, in.QuestionId)
		if err != nil {
			return err
		}

		questionTextEntity := constant.QuestionTextEntity{
			QuestionId: in.QuestionId,
			Type:       constant.GroupName,
		}

		_, err = service.academicLevelStorage.QuestionTextCaseDeleteByType(in.Tx, &questionTextEntity)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
		}

		for i, group := range in.Groups {
			questionTextEntity := constant.QuestionTextEntity{
				QuestionId:       in.QuestionId,
				SavedTextGroupId: &group.SavedTextGroupId,
				Type:             constant.GroupName,
			}

			questionText, err := service.academicLevelStorage.QuestionTextCreate(in.Tx, &questionTextEntity)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return err
			}

			group.QuestionGroupId = in.QuestionId
			group.QuestionTextId = questionText.Id
			questionGroupGroup, err := service.academicLevelStorage.QuestionGroupGroupCreate(in.Tx, &group)
			if err != nil {
				return err
			}
			in.Groups[i] = *questionGroupGroup
		}
	}

	return nil
}
