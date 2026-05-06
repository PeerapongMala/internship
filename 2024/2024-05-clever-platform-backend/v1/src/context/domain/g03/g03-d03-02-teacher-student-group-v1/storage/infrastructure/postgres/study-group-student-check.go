package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) StudyGroupStudentCheck(classId, subjectId int, userId string) (bool, error) {
	query := `
		SELECT EXISTS (
			SELECT 1
			FROM "class"."study_group_student" sgs
			INNER JOIN "class"."study_group" sg ON "sgs"."study_group_id" = "sg"."id"
			WHERE "sg"."class_id" = $1 AND "sg"."subject_id" = $2 AND "sgs"."student_id" = $3 AND "sg"."status" = 'enabled'
		)
	`
	var isExists bool
	err := postgresRepository.Database.QueryRowx(query, classId, subjectId, userId).Scan(&isExists)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return false, err
	}
	return isExists, nil
}
