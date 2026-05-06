package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d03-academic-lesson-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) LessonCreate(tx *sqlx.Tx, lesson *constant.LessonEntity) (*constant.LessonEntity, error) {
	query := `
		INSERT INTO "subject"."lesson" (subject_id, index, name, status, created_at, created_by, admin_login_as, wizard_index, background_image_path, font_name, font_size) 
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		RETURNING *
	`
	lessonEntity := constant.LessonEntity{}
	err := tx.QueryRowx(
		query,
		lesson.SubjectId,
		lesson.Index,
		lesson.Name,
		lesson.Status,
		lesson.CreatedAt,
		lesson.CreatedBy,
		lesson.AdminLoginAs,
		lesson.WizardIndex,
		lesson.BackgroundImagePath,
		lesson.FontName,
		lesson.FontSize,
	).StructScan(&lessonEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &lessonEntity, nil
}
