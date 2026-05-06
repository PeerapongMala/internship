package postgres

import (
	"log"

	"github.com/lib/pq"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetAllStudentIds(seedYearIds, studentGroupIds, classIds []int, schoolId int) ([]string, error) {
	query := `
		SELECT 
			"cs"."student_id"
		FROM
			"class"."class" c
			INNER JOIN "school"."class_student" cs ON "c"."id" = "cs"."class_id"
		WHERE 
			"c"."school_id" = $4 
			AND ("c"."year" = ANY($3) OR "c"."id" = ANY($1))
		UNION ALL
		SELECT
			"sgs"."student_id"
		FROM
			"class"."study_group" sg
			INNER JOIN "class"."study_group_student" sgs ON "sg"."id" = "sgs"."study_group_id"
			INNER JOIN "class"."class" c ON "sg"."class_id" = "c"."id"
		WHERE
			"sg"."id" = ANY($2) 
			AND "c"."school_id" = $4
	`

	rows, err := postgresRepository.Database.Queryx(query, pq.Array(classIds), pq.Array(studentGroupIds), pq.Array(seedYearIds), schoolId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	resp := []string{}
	for rows.Next() {
		var studentId string
		err := rows.Scan(&studentId)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		resp = append(resp, studentId)
	}

	return resp, nil
}
