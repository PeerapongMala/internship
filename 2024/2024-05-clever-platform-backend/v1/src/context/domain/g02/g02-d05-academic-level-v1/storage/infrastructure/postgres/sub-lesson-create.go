package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

// SubLessonCreate for CM only
func (postgresRepository *postgresRepository) SubLessonCreate(tx *sqlx.Tx, subLesson *constant.SubLessonEntity) (*constant.SubLessonEntity, error) {
	query := `
		INSERT INTO "subject"."sub_lesson" (
			"lesson_id",
		    "index",
			"name",
			"status",
			"created_at",
			"created_by",
			"admin_login_as",
			"indicator_id"
		)
		VALUES ($1, (SELECT COALESCE(MAX("index"), 0) + 1 FROM "subject"."sub_lesson" WHERE "lesson_id" = $1), $2, $3, $4, $5, $6, 0)
		RETURNING *
	`
	subLessonEntity := constant.SubLessonEntity{}
	err := tx.QueryRowx(query,
		subLesson.LessonId, subLesson.Name, subLesson.Status, subLesson.CreatedAt, subLesson.CreatedBy, subLesson.AdminLoginAs).StructScan(&subLessonEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &subLessonEntity, nil
}
