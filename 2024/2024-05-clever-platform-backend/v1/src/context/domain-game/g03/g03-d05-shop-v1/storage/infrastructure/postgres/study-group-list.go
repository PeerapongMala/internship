package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) StudyGroupList(classId int, subjectId int, studentId string) ([]int, error) {
	query := `
		SELECT
			"sg"."id"
		FROM "class"."study_group" sg
		INNER JOIN "class"."study_group_student" sgs ON "sg"."id" = "sgs"."study_group_id"
		WHERE
		    "sgs"."student_id" = $1
			AND "sg"."subject_id" = $2
			AND "sg"."class_id" = $3
	`
	studyGroupIds := []int{}
	err := postgresRepository.Database.Select(&studyGroupIds, query, studentId, subjectId, classId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return studyGroupIds, nil
}
