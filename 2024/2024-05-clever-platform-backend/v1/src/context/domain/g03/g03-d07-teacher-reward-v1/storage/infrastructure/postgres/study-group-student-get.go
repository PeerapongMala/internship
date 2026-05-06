package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) StudyGroupStudentGet(studyGroupIds []int) ([]string, error) {
	query := `
		SELECT DISTINCT ON ("sgs"."student_id")
			"student_id"	
		FROM "class"."study_group_student" sgs
		WHERE "study_group_id" = ANY($1)
	`
	ids := []string{}
	err := postgresRepository.Database.Select(&ids, query, studyGroupIds)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return ids, err
	}
	return ids, nil
}
