package postgres

import (
	"fmt"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
	"strings"
)

func (postgresRepository *postgresRepository) SubjectTeacherCreate(tx *sqlx.Tx, subjectId int, teacherIds []string, academicYear int) error {
	args := []interface{}{}
	placeholders := []string{}

	for i, teacherId := range teacherIds {
		placeholders = append(placeholders, fmt.Sprintf(`($%d, $%d, $%d)`, i*3+1, i*3+2, i*3+3))
		args = append(args, subjectId, teacherId, academicYear)
	}

	query := fmt.Sprintf(`
		INSERT INTO
			"subject"."subject_teacher" (
				"subject_id",
				"teacher_id",
				"academic_year"
			)
		VALUES %s
		ON CONFLICT ("subject_id", "teacher_id", "academic_year") DO NOTHING
	`, strings.Join(placeholders, ", "))

	_, err := tx.Exec(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
