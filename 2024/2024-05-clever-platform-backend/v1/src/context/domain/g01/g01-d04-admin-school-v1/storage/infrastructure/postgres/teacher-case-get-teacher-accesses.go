package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) TeacherCaseGetTeacherAccesses(userId string) ([]int, error) {
	query := `
		SELECT
			"teacher_access_id" AS "id"
		FROM
			"user"."user_teacher_access"	
		WHERE
			"user_id" = $1
	`
	teacherAccessIds := []int{}
	err := postgresRepository.Database.Select(&teacherAccessIds, query, userId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return teacherAccessIds, nil
}
