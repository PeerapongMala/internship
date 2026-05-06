package postgres

import (
	"github.com/jmoiron/sqlx"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SavedTextCaseGetByGroupLanguage(tx *sqlx.Tx, groupId string, language string) (*constant.SavedTextEntity, error) {
	var queryMethod func(query string, args ...interface{}) *sqlx.Row
	if tx == nil {
		queryMethod = postgresRepository.Database.QueryRowx
	} else {
		queryMethod = tx.QueryRowx
	}
	query := `
		SELECT
			*
		FROM "curriculum_group"."saved_text"
		WHERE
			"group_id"  = $1	
			AND
			"language" = $2
	`
	savedTextEntity := constant.SavedTextEntity{}
	err := queryMethod(
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
