package postgres

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jackc/pgx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherStudentRepository) SchoolInfoGetByTeacherId(teacherId string) (constant.SchoolEntity, error) {
	stm := `
		SELECT
			school.id,
			school.name,
			school.code,
			school.image_url

		FROM school.school AS school
		WHERE school.id = (
			SELECT school_id
			FROM school.school_teacher AS school_teacher
			WHERE school_teacher.user_id = $1
		) AND school.status = $2
	`
	var school constant.SchoolEntity
	err := postgresRepository.Database.Get(&school, stm, teacherId, constant.SCHOOL_ENABLE_STATUS)
	if err != nil && errors.Is(err, pgx.ErrNoRows) {
		log.Printf("%+v", errors.WithStack(err))
		return school, helper.NewHttpError(http.StatusNotFound, nil)
	}

	return school, nil

}
