package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-02-teacher-student-group-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) StudyGroupGet(studyGroupId int) (*constant.StudyGroup, error) {
	query := `
		SELECT
			"id",
			"subject_id",
			"class_id"
		FROM "class"."study_group"
		WHERE "id" = $1
	`
	var studyGroup constant.StudyGroup
	err := postgresRepository.Database.QueryRowx(query, studyGroupId).StructScan(&studyGroup)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	return &studyGroup, nil
}
