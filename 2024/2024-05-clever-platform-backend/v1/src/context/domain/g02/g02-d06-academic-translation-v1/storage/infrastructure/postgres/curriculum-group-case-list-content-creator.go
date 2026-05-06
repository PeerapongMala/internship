package postgres

import (
	"log"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) CurriculumGroupCaseListContentCreator(curriculumGroupId int) ([]userConstant.UserEntity, error) {
	query := `
		SELECT
			"u".*	
		FROM "curriculum_group"."curriculum_group_content_creator" cgcc
		LEFT JOIN "user"."user" u
			ON "cgcc"."content_creator_id" = "u"."id"
		WHERE "cgcc"."curriculum_group_id" = $1
	`
	userEntities := []userConstant.UserEntity{}
	err := postgresRepository.Database.Select(&userEntities, query, curriculumGroupId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return userEntities, nil
}
