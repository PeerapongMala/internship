package postgres

import (
	"log"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-01-teacher-student-group-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) UpdateStudyGroup(data *constant.UpdateStudyGroup) error {

	query := `
		UPDATE class.study_group
		SET 
			name = $1, 
			status = $2, 
			class_id = $3 ,
			subject_id = $4,
			updated_at = $5, 
			updated_by = $6
		WHERE id = $7;
	`

	_, err := postgresRepository.Database.Exec(query,
		data.Name,
		data.Status,
		data.ClassID,
		data.SubjectID,
		time.Now(),
		data.UserID,
		data.ID,
	)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
