package postgres

import (
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherStudentRepository) SubLessonListByLessonId(lessonId int) ([]constant.TeacherStudentFilter, error) {
	sql := `
		SELECT id, name FROM subject.sub_lesson sl 
		WHERE lesson_id = $1
		ORDER BY id
	`

	subLessonList := []constant.TeacherStudentFilter{}
	err := postgresRepository.Database.Select(&subLessonList, sql, lessonId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return subLessonList, helper.NewHttpError(http.StatusNotFound, nil)
	}

	return subLessonList, nil
}
