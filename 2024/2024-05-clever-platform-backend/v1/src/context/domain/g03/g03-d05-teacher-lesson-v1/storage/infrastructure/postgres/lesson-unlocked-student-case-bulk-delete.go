package postgres

import (
	"fmt"
	"github.com/pkg/errors"
	"log"
	"strings"
)

func (postgresRepository *postgresRepository) LessonUnlockedStudentCaseBulkDelete(classId, lessonId int, studentIds []string) error {
	args := []interface{}{classId, lessonId}
	placeholders := []string{}

	for i, studentId := range studentIds {
		placeholders = append(placeholders, fmt.Sprintf(`($%d::text)`, i+3))
		args = append(args, studentId)
	}

	query := fmt.Sprintf(`
		DELETE FROM "school"."lesson_unlocked_for_student" lu
		USING (VALUES %s) AS tmp(student_id)
		WHERE "lu"."user_id" = tmp."student_id"
		AND "lu"."class_id" = $1
		AND "lu"."lesson_id" = $2
	`, strings.Join(placeholders, ","))

	_, err := postgresRepository.Database.Exec(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
