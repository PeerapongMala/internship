package postgres

import (
	"database/sql"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SavedTextCaseGetByText(tx *sqlx.Tx, language string, text string) (*constant.SavedTextEntity, error) {
	query := `
		SELECT 
			*
		FROM "curriculum_group"."saved_text"
		WHERE
			"language" = $1	
			AND
			"text" = $2
	`
	savedTextEntity := constant.SavedTextEntity{}
	err := tx.QueryRowx(query, language, text).StructScan(&savedTextEntity)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &savedTextEntity, nil
}
