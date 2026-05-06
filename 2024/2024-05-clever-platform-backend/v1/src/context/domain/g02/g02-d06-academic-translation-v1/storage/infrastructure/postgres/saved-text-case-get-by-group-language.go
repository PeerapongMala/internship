package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d06-academic-translation-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SavedTextCaseGetByGroupLanguage(groupId string, language string) (*constant.SavedTextEntity, error) {
	query := `
		SELECT
			*
		FROM
			"curriculum_group"."saved_text"	
		WHERE
			"group_id" = $1
			AND
			"language" = $2
	`
	savedTextEntity := constant.SavedTextEntity{}
	err := postgresRepository.Database.QueryRowx(
		query,
		groupId,
		language,
	).StructScan(&savedTextEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &savedTextEntity, nil
}
