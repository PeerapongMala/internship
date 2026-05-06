package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) InsertHomeworkTemplate(tx *sqlx.Tx, entity *constant.HomeworkTemplateEntity) (insertId int, err error) {
	
	query := `
		INSERT INTO homework.homework_template (
		  "subject_id",
			"year_id",
			"lesson_id",
			"teacher_id",
			"name",
			"status",
			"created_at",
			"created_by"
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)	
		RETURNING id;
	`

	err = tx.QueryRowx(
		query,
		entity.SubjectId,
		entity.YearId,
		entity.LessonId,
		entity.TeacherId,
		entity.Name,
		entity.Status,
		entity.CreatedAt,
		entity.CreatedBy,
	).Scan(&insertId)
	
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return insertId, err
	}

	return insertId, nil
}
