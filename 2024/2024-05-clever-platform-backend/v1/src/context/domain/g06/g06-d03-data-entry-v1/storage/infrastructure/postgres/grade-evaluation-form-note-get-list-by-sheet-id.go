package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetListEvaluationFormNoteBySheetId(sheetID int) ([]constant.EvaluationFormNote, error) {
	query := `
		SELECT 
			efn.id,
			efn.sheet_id,
			efn.note_value,
			efn.created_at,
			efn.created_by,
			efn.updated_at,
			(SELECT "sub_u"."first_name" FROM "user"."user" sub_u WHERE sub_u."id" = efn.updated_by LIMIT 1) AS updated_by,
			u.title,
			u.first_name,
			u.last_name,
			u.image_url
		FROM
			grade.evaluation_form_note efn
		LEFT JOIN "user"."user" u ON efn.created_by = u.id
		WHERE sheet_id = $1
		ORDER BY id DESC 
	`

	rows, err := postgresRepository.Database.Queryx(query, sheetID)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	defer rows.Close()

	notes := []constant.EvaluationFormNote{}
	for rows.Next() {
		var note constant.EvaluationFormNote
		if err := rows.StructScan(&note); err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		notes = append(notes, note)
	}
	return notes, nil
}
