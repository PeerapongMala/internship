package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) QuestionCaseGetCurriculumGroupId(questionId int) (*int, error) {
	query := `
		SELECT
			"y"."curriculum_group_id"
		FROM "question"."question" q	
		LEFT JOIN "level"."level" l
			ON "q"."level_id" = "l"."id"
		LEFT JOIN "subject"."sub_lesson" sl
			ON "l"."sub_lesson_id" = "sl"."id"
		LEFT JOIN "subject"."lesson" ls
			ON "sl"."lesson_id" = "ls"."id"
		LEFT JOIN "subject"."subject" s
			ON "ls"."subject_id" = "s"."id"
		LEFT JOIN "curriculum_group"."subject_group" sg
			ON "s"."subject_group_id" = "sg"."id"
		LEFT JOIN "curriculum_group"."year" y
			ON "sg"."year_id" = "y"."id"
		WHERE "q"."id" = $1
	`
	var curriculumGroupId int
	err := postgresRepository.Database.QueryRowx(query, questionId).Scan(&curriculumGroupId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &curriculumGroupId, nil
}
