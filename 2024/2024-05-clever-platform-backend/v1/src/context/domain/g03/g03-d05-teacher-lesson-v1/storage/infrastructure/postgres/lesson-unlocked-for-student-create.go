package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d05-teacher-lesson-v1/constant"
	"github.com/pkg/errors"
	"log"
	"strings"
)

func (postgresRepository *postgresRepository) LessonUnlockedForStudentCreate(lessonUnlockedForStudent []constant.LessonUnlockedForStudent) error {
	if len(lessonUnlockedForStudent) == 0 {
		return nil
	}

	query := `
		INSERT INTO "school"."lesson_unlocked_for_student" (
			"class_id",
			"user_id",
			"lesson_id",
			"lock"
		)
		VALUES
	`
	args := []interface{}{}
	placeholders := []string{}

	for i, record := range lessonUnlockedForStudent {
		start := i*4 + 1
		placeholders = append(placeholders, fmt.Sprintf(`($%d, $%d, $%d, $%d)`, start, start+1, start+2, start+3))
		args = append(args,
			record.ClassId,
			record.StudentId,
			record.LessonId,
			false,
		)
	}

	query += fmt.Sprintf(`%s ON CONFLICT ("class_id", "user_id", "lesson_id") DO NOTHING`, strings.Join(placeholders, ","))
	_, err := postgresRepository.Database.Exec(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
