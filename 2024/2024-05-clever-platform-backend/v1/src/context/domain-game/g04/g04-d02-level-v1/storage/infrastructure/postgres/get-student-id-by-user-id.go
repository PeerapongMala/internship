package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetStudentIdFromUserId(userId string) (*string, error) {
	query := `
		SELECT 
			student_id
		FROM
			"user"."student"
		WHERE user_id = $1
	`

	var studentId string
	err := postgresRepository.Database.QueryRowx(query, userId).Scan(&studentId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &studentId, nil
}
