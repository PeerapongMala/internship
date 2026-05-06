package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d06-subject-teacher/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SubjectGet(subjectId int) (*constant.SubjectEntity, error) {
	query := `
		SELECT
			"s"."id",
			"s"."name",
			"sy"."short_name" AS "year"	
		FROM
		    "subject"."subject"s
		LEFT JOIN
		    "curriculum_group"."subject_group" sg
			ON "s"."subject_group_id" = "sg"."id"
		LEFT JOIN
		   	"curriculum_group"."year" y 
			ON "sg"."year_id" = "y"."id"
		LEFT JOIN
		    "curriculum_group"."seed_year" sy
			ON "y"."seed_year_id" = "sy"."id"
		WHERE
		    "s"."id" = $1
	`
	subjectEntity := constant.SubjectEntity{}
	err := postgresRepository.Database.QueryRowx(query, subjectId).StructScan(&subjectEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &subjectEntity, nil
}
