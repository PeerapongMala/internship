package postgres

import (
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) InsertHomeworkAssignedToClass(tx *sqlx.Tx, homeworkId int, classId int) (err error) {
	
	query := `
		INSERT INTO homework.homework_assigned_to_class (
		  "class_id",
			"homework_id",
			"assigned_at"
		)
		VALUES ($1, $2, now());
	`

	err = tx.QueryRowx(
		query,
		classId,
		homeworkId,
	).Err()
	
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}

func (postgresRepository *postgresRepository) InsertHomeworkAssignedToStudyGroup(tx *sqlx.Tx, homeworkId int, studyGroupId int) (err error) {
	
	query := `
		INSERT INTO homework.homework_assigned_to_study_group (
		  "study_group_id",
			"homework_id",
			"assigned_at"
		)
		VALUES ($1, $2, now());
	`

	err = tx.QueryRowx(
		query,
		studyGroupId,
		homeworkId,
	).Err()
	
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}

func (postgresRepository *postgresRepository) InsertHomeworkAssignedToYear(tx *sqlx.Tx, homeworkId int, seedYearId int) (err error) {
	
	query := `
		INSERT INTO homework.homework_assigned_to_year (
		  "seed_year_id",
			"homework_id",
			"assigned_at"
		)
		VALUES ($1, $2, now());
	`

	err = tx.QueryRowx(
		query,
		seedYearId,
		homeworkId,
	).Err()
	
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}