package postgres

import (
	"fmt"
	"log"
)

func (postgresRepository *postgresRepository) SubjectList(schoolId int, academicYear string) ([]string, error) {
	query := `
		SELECT DISTINCT
			ts.subject_name
		FROM "grade"."evaluation_form" ef
		INNER JOIN "grade"."template" t ON "ef"."template_id" = "t"."id"
		INNER JOIN "grade"."template_subject" ts ON "t"."id" = "ts"."template_id"
		WHERE 	
			"ef"."school_id" = $1
			AND ts.subject_name IS NOT NULL
		`
	args := []interface{}{schoolId}
	argsIndex := len(args) + 1

	if academicYear != "" {
		query += fmt.Sprintf(` AND "ef"."academic_year" = $%d`, argsIndex)
		args = append(args, academicYear)
		argsIndex++
	}

	subjects := []string{}
	err := postgresRepository.Database.Select(&subjects, query, args...)
	if err != nil {
		log.Printf("%+v", err)
		return nil, err
	}

	return subjects, nil
}
