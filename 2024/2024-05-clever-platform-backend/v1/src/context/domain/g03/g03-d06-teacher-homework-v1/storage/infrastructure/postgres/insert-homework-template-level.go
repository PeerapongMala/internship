package postgres

import (
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) InsertHomeworkTemplateLevel(tx *sqlx.Tx, homeworkTemplateId int, levelId int) (err error) {
	
	query := `
		INSERT INTO homework.homework_template_level (
		  "homework_template_id",
			"level_id"
		)
		VALUES ($1, $2);
	`

	err = tx.QueryRowx(
		query,
		homeworkTemplateId,
		levelId,
	).Err()
	
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
