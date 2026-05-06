package postgres

import (
	"database/sql"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) StudentGetClassByAcademicYear(userId string, academicYear int) (*string, error) {
	query := `
		SELECT
			CONCAT("c"."year", "c"."name")
		FROM "school"."class_student" cs
		INNER JOIN "class"."class" c ON "cs"."class_id" = "c"."id"
		WHERE "cs"."student_id" = $1 AND "c"."academic_year" = $2
	`
	var room string
	err := postgresRepository.Database.QueryRowx(query, userId, academicYear).Scan(&room)
	if err != nil && err != sql.ErrNoRows {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &room, nil
}
