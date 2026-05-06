package postgres

import (
	"log"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-01-teacher-student-group-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) InsertStudyGroup(data *constant.InsertStudyGroup) error {
	query := `
		INSERT INTO class.study_group 
		(class_id, subject_id, name, status, created_at, created_by)
		VALUES ($1, $2, $3, $4, $5, $6); `

	_, err := postgresRepository.Database.Exec(query,
		data.ClassID,
		data.SubjectID,
		data.Name,
		data.Status,
		time.Now(),
		data.UserID,
	)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
