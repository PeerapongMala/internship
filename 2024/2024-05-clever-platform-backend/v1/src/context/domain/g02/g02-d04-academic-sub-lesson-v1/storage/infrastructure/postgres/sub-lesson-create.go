package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d04-academic-sub-lesson-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SubLessonCreate(tx *sqlx.Tx, subLesson *constant.SubLessonEntity) (*constant.SubLessonEntity, error) {
	query := `
		INSERT INTO "subject"."sub_lesson" (lesson_id, indicator_id, name, status, created_at, created_by, updated_at, updated_by, admin_login_as, index) 
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING *
	`
	subLessonEntity := constant.SubLessonEntity{}
	err := tx.QueryRowx(
		query,
		subLesson.LessonId,
		subLesson.IndicatorId,
		subLesson.Name,
		subLesson.Status,
		subLesson.CreatedAt,
		subLesson.CreatedBy,
		subLesson.UpdatedAt,
		subLesson.UpdatedBy,
		subLesson.AdminLoginAs,
		subLesson.Index,
	).StructScan(&subLessonEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &subLessonEntity, nil
}
