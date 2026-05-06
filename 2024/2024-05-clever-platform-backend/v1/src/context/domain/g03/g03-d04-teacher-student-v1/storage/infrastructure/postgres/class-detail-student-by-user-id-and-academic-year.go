package postgres

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherStudentRepository) ClassDetailStudentByUserIdAndAcademicYear(
	userId string,
	academicYear int,
) (constant.ClassEntity, error) {
	queryStm := `
		SELECT
			c.id,
			c."year",
			c."name",
			c.academic_year,
			c.updated_at,
			c.updated_by
		FROM "class"."class" c
		INNER JOIN school.class_student cs ON cs.class_id = c.id
		WHERE cs.student_id = $1
		AND c.academic_year = $2
		GROUP BY cs.student_id, c.id
	`

	student := constant.ClassEntity{}
	err := postgresRepository.Database.QueryRowx(queryStm, userId, academicYear).StructScan(&student)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		log.Printf("%+v", errors.WithStack(err))
		return student, helper.NewHttpError(http.StatusNotFound, nil)
	}

	return student, nil
}
