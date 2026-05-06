package service

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
	"log"
	"net/http"
)

type CreateQuestionGroupGroupMemberInput struct {
	Tx                  *sqlx.Tx
	QuestionGroupGroups []constant.QuestionGroupGroupEntity
	QuestionGroupChoice constant.QuestionGroupChoiceEntity
}

func (service *serviceStruct) CreateQuestionGroupGroupMember(in *CreateQuestionGroupGroupMemberInput) error {
	log.Println("group indexes ", in.QuestionGroupChoice.GroupIndexes)
	for _, groupIndex := range in.QuestionGroupChoice.GroupIndexes {
		for i, questionGroupGroup := range in.QuestionGroupGroups {
			if questionGroupGroup.Index == groupIndex {
				questionGroupGroupMemberEntity := constant.QuestionGroupGroupMemberEntity{
					QuestionGroupGroupId:  questionGroupGroup.Id,
					QuestionGroupChoiceId: in.QuestionGroupChoice.Id,
				}
				_, err := service.academicLevelStorage.QuestionGroupGroupMemberCreate(in.Tx, &questionGroupGroupMemberEntity)
				if err != nil {
					return err
				}
				break
			}
			if i == len(in.QuestionGroupGroups)-1 {
				msg := fmt.Sprintf(`Group index %d doesn't exist`, groupIndex)
				return helper.NewHttpError(http.StatusBadRequest, &msg)
			}
		}
	}

	return nil
}
