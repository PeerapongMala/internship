package postgres

import (
	"fmt"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
	"strings"
)

func (postgresRepository *postgresRepository) ClassSubLessonCreate(tx *sqlx.Tx, schoolId int, classId int, subLessonIds []int) error {
	if len(subLessonIds) == 0 {
		return nil
	}
	args := []interface{}{}
	placeholders := []string{}

	argsIndex := 1
	for _, subLessonId := range subLessonIds {
		placeholders = append(placeholders, fmt.Sprintf(`($%d, $%d, $%d, $%d)`, argsIndex, argsIndex+1, argsIndex+2, argsIndex+3))
		args = append(args, schoolId, subLessonId, classId, true)
		argsIndex += 4
	}

	query := fmt.Sprintf(`
		INSERT INTO
			"school"."school_sub_lesson" (
				"school_id",
				"sub_lesson_id",
				"class_id",
				"is_enabled"
			)	
		VALUES %s
		ON CONFLICT ("school_id", "sub_lesson_id", "class_id") DO NOTHING
	`, strings.Join(placeholders, ", "))

	_, err := tx.Exec(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
