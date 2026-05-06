package postgres

import (
	"fmt"
	"log"

	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d02-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) LevelCaseGetLastPlay(subLessonId, lessonId, subjectId int, studentId string) (*constant2.LastPlayLevelEntity, error) {
	query := `
		SELECT
			"lpl"."level_id",
			"sl"."id" AS "sub_lesson_id",
			"ls"."id" AS "lesson_id",
			"ls"."subject_id"
		FROM "level"."level_play_log" lpl
		INNER JOIN "level"."level" l ON "lpl"."level_id" = "l"."id"
		INNER JOIN "subject"."sub_lesson" sl ON "l"."sub_lesson_id" = "sl"."id"
		INNER JOIN "subject"."lesson" ls ON "sl"."lesson_id" = "ls"."id"
		WHERE
		    "lpl"."homework_id" IS NULL
			AND "lpl"."student_id" = $1
	`
	args := []interface{}{studentId}
	argsIndex := len(args) + 1

	if subLessonId != 0 {
		args = append(args, subLessonId)
		query += fmt.Sprintf(` AND "sl"."id" = $%d`, argsIndex)
		argsIndex++
	}

	if lessonId != 0 {
		args = append(args, lessonId)
		query += fmt.Sprintf(` AND "ls"."id" = $%d`, argsIndex)
		argsIndex++
	}

	if subjectId != 0 {
		args = append(args, subjectId)
		query += fmt.Sprintf(` AND "ls"."subject_id" = $%d`, argsIndex)
		argsIndex++
	}

	query += `
		ORDER BY "played_at" DESC
		LIMIT 1
	`

	level := constant2.LastPlayLevelEntity{}
	err := postgresRepository.Database.QueryRowx(query, args...).StructScan(&level)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &level, nil
}
