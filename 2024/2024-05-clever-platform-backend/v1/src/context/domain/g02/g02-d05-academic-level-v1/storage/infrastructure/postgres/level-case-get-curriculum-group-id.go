package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) LevelCaseGetCurriculumGroupId(levelId int) (*int, error) {
	log.Println(levelId)
	query := `
		SELECT
			"y"."curriculum_group_id"
		FROM "level"."level" l
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
		WHERE "l"."id" = $1
	`
	var curriculumGroupId int
	err := postgresRepository.Database.QueryRowx(query, levelId).Scan(&curriculumGroupId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &curriculumGroupId, nil
}
