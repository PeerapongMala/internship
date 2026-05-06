package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SubjectCreate(tx *sqlx.Tx, subject *constant.SubjectEntity) (*constant.SubjectEntity, error) {
	query := `
		INSERT INTO "subject"."subject" (
			"subject_group_id",
			"name",
			"project",
			"subject_language_type",
			"subject_language",
			"image_url",
			"status",
			"created_at",
			"created_by",
			"admin_login_as"
		)	
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING *
 	`
	subjectEntity := constant.SubjectEntity{}
	err := tx.QueryRowx(
		query,
		subject.SubjectGroupId,
		subject.Name,
		subject.Project,
		subject.SubjectLanguageType,
		subject.SubjectLanguage,
		subject.ImageUrl,
		subject.Status,
		subject.CreatedAt,
		subject.CreatedBy,
		subject.AdminLoginAs,
	).StructScan(&subjectEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &subjectEntity, nil
}
