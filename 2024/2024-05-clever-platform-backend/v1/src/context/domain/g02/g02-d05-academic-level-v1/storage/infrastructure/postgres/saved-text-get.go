package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SavedTextGet(tx *sqlx.Tx, savedTextId int) (*constant.SavedTextEntity, error) {
	query := `
		SELECT
			*
		FROM
			"curriculum_group"."saved_text"
		WHERE
			"id" = $1	
	`
	savedTextEntity := constant.SavedTextEntity{}
	err := tx.QueryRowx(query, savedTextId).StructScan(&savedTextEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	log.Println("this is from savedtext ", savedTextEntity.Id, savedTextEntity.SpeechUrl)

	return &savedTextEntity, nil
}
