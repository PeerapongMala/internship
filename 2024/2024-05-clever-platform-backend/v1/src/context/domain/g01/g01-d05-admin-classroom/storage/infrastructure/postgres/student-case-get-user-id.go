package postgres

import (
	"database/sql"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) StudentCaseGetUserId(schoolId int, studentId string) (string, error) {
	query := `
		SELECT 
			"user_id"
		FROM "user"."student"
		WHERE "school_id" = $1 AND "student_id" = $2
	`
	var userId string
	err := postgresRepository.Database.QueryRowx(query, schoolId, studentId).Scan(&userId)
	if err != nil && err != sql.ErrNoRows {
		log.Printf("%+v", errors.WithStack(err))
		return "", err
	}

	return userId, nil
}
