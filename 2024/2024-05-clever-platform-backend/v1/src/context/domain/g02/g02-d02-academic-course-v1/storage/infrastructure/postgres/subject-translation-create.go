package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SubjectTranslationCreate(tx *sqlx.Tx, subjectTranslation *constant.SubjectTranslationEntity) (*constant.SubjectTranslationEntity, error) {
	query := `
		INSERT INTO "subject"."subject_translation" (
			"subject_id",
			"language"
		)	
		VALUES ($1, $2)
		RETURNING *
	`
	subjectTranslationEntity := constant.SubjectTranslationEntity{}
	err := tx.QueryRowx(
		query,
		subjectTranslation.SubjectId,
		subjectTranslation.Language,
	).StructScan(&subjectTranslationEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &subjectTranslationEntity, nil
}
