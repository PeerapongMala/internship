package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) EvaluationFormNoteInsert(tx *sqlx.Tx, entity *constant.EvaluationFormNote) (insertId int, err error) {
	query := `
		INSERT INTO grade.evaluation_form_note (
			sheet_id, 
			note_value, 
			created_at, 
			created_by, 
			updated_at, 
			updated_by
		)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id;
	`

	err = tx.QueryRowx(
		query,
		entity.SheetID,
		entity.NoteValue,
		entity.CreatedAt,
		entity.CreatedBy,
		entity.UpdatedAt,
		entity.UpdatedBy,
	).Scan(&insertId)

	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return insertId, err
	}

	return insertId, nil
}
