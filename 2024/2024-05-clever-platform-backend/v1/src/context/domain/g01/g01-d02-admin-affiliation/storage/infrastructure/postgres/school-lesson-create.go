package postgres

import (
	"fmt"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
	"strings"
)

func (postgresRepository *postgresRepository) SchoolLessonCreate(tx *sqlx.Tx, schoolId int, lessonIds []int, classIds []int) error {
	if len(classIds) == 0 || len(lessonIds) == 0 {
		return nil
	}
	args := []interface{}{}
	placeholders := []string{}

	query := `
		SELECT
		    "id",
			"name"
		FROM "subject"."lesson" ls
		WHERE
		    "ls"."id" = ANY($1)
	`
	lessons := []struct {
		Id   int
		Name string
	}{}
	err := tx.Select(&lessons, query, lessonIds)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	mapLessons := map[int]string{}
	for _, lesson := range lessons {
		mapLessons[lesson.Id] = lesson.Name
	}

	argsIndex := 1
	for _, classId := range classIds {
		for _, lessonId := range lessonIds {
			placeholders = append(placeholders, fmt.Sprintf(`($%d, $%d, $%d, $%d)`, argsIndex, argsIndex+1, argsIndex+2, argsIndex+3))
			isExtra := false
			_, ok := mapLessons[lessonId]
			if ok && strings.Contains(strings.ToLower(mapLessons[lessonId]), "extra") {
				isExtra = true
			}
			args = append(args, schoolId, lessonId, classId, !isExtra)
			argsIndex += 4
		}
	}

	query = fmt.Sprintf(`
		INSERT INTO
			"school"."school_lesson" (
				"school_id",	
				"lesson_id",
				"class_id",
			    "is_enabled"
			)
		VALUES %s
		ON CONFLICT ("school_id", "lesson_id", "class_id") DO NOTHING
	`, strings.Join(placeholders, ", "))

	_, err = tx.Exec(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
