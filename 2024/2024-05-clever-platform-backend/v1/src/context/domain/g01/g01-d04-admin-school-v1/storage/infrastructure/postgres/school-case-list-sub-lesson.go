package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SchoolCaseListSubLesson(schoolId int) ([]int, error) {
	query := `
		SELECT DISTINCT ON ("sl"."id")
			"sl"."id"
		FROM
		    "school_affiliation"."contract_school" cs
		LEFT JOIN
			"school_affiliation"."contract_subject_group" csg 
			ON "cs"."contract_id" = "csg"."contract_id"	
		LEFT JOIN
			"subject"."subject" s
			ON "csg"."subject_group_id" = "s"."subject_group_id"
		LEFT JOIN
			"subject"."lesson" ls
			ON "s"."id" = "ls"."subject_id"
		LEFT JOIN
			"subject"."sub_lesson" sl
			ON "ls"."id" = "sl"."lesson_id"
		WHERE	
			"cs"."school_id" = $1
			AND "sl"."id" IS NOT NULL
	`
	subLessonIds := []int{}
	err := postgresRepository.Database.Select(&subLessonIds, query, schoolId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return subLessonIds, nil
}
