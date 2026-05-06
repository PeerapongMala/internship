package postgres

import (
	"fmt"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
	"strings"
)

func (postgresRepository *postgresRepository) LessonLevelLockCreate(tx *sqlx.Tx, classIds []int, subLessonIds []int) error {
	if len(classIds) == 0 || len(subLessonIds) == 0 {
		return nil
	}

	args := []interface{}{}
	placeholders := []string{}

	argsIndex := 1
	for _, classId := range classIds {
		for _, subLessonId := range subLessonIds {
			placeholders = append(placeholders, fmt.Sprintf(`($%d, $%d, $%d)`, argsIndex, argsIndex+1, argsIndex+2))
			args = append(args, classId, subLessonId, true)
			argsIndex += 3
		}
	}

	query := fmt.Sprintf(`
		INSERT INTO "school"."lesson_level_lock" (
			"class_id",
			"sub_lesson_id",
			"lock"
		)
		VALUES %s
		ON CONFLICT ("class_id", "sub_lesson_id") DO NOTHING
	`, strings.Join(placeholders, ", "))

	_, err := tx.Exec(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
