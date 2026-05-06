package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) CurrentClassGet(studentId string) (int, error) {
	query := `
		SELECT
			"cs"."class_id"
		FROM "school"."class_student" cs
		INNER JOIN "class"."class" c ON "cs"."class_id" = "c"."id"
		WHERE "cs"."student_id" = $1
		ORDER BY "c"."academic_year" DESC
		LIMIT 1
	`
	classId := 0
	err := postgresRepository.Database.QueryRowx(query, studentId).Scan(&classId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return classId, err
	}
	return classId, nil
}
