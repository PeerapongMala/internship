package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) InsertHomework(tx *sqlx.Tx, entity *constant.HomeworkEntity) (insertId int, err error) {
	
	query := `
		INSERT INTO homework.homework (
		  "name",
			"subject_id",
			"year_id",
			"homework_template_id",
			"started_at",
			"due_at",
			"closed_at",
			"status",	
			"created_at",
			"created_by"
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)	
		RETURNING id;
	`

	err = tx.QueryRowx(
		query,
		entity.Name,
		entity.SubjectId,
		entity.YearId,
		entity.HomeworkTemplateId,
		entity.StartedAtTime,
		entity.DueAtTime,
		entity.ClosedAtTime,
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
