package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d06-subject-teacher/constant"
	"github.com/pkg/errors"
	"log"
	"strings"
)

func (postgresRepository *postgresRepository) SubjectTeacherDelete(subjectId int, bulkEditList []constant.SubjectTeacherBulkEditItem) error {
	args := []interface{}{subjectId}
	placeholders := []string{}

	for i, bulkEditItem := range bulkEditList {
		placeholders = append(placeholders, fmt.Sprintf(`($%d::text, $%d::integer)`, i*2+2, i*2+3))
		args = append(args, bulkEditItem.TeacherId, bulkEditItem.AcademicYear)
	}

	query := fmt.Sprintf(`
        DELETE FROM subject.subject_teacher
        USING (VALUES %s) AS tmp(teacher_id, academic_year)
        WHERE subject_teacher.teacher_id = tmp.teacher_id
        AND subject_teacher.academic_year = tmp.academic_year
        AND subject_teacher.subject_id = $1
    `, strings.Join(placeholders, ", "))

	_, err := postgresRepository.Database.Exec(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
