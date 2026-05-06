package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) AdminProgressGetSchoolTeacherClassStatistics(teacherID string) (name string, classRoomCount int, homeworkCount int, err error) {
	query1 := `
		SELECT 
			CONCAT("u"."title", ' ', "u"."first_name", ' ', "u"."last_name") 
		FROM 
			"user"."user" AS "u"
		WHERE
			"u"."id" = $1
	`
	args1 := []interface{}{teacherID}
	err = postgresRepository.Database.QueryRowx(query1, args1...).Scan(&name)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return
	}

	query2 := `
		SELECT 
			COUNT(*)
		FROM (
			SELECT 
				* 
			FROM 
				"school"."class_teacher" AS "ct"
			WHERE
				"ct"."teacher_id" = $1
		)
	`
	args2 := []interface{}{teacherID}
	err = postgresRepository.Database.QueryRowx(query2, args2...).Scan(&classRoomCount)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return
	}

	query3 := `
		SELECT
			COUNT(*)
		FROM (
			SELECT 
				*
			FROM
				"question"."question" AS "q"
					LEFT JOIN "level"."level" AS "l" ON "q".level_id = "l"."id"
					LEFT JOIN "homework"."homework_template_level" AS "htl" ON "htl"."level_id" = "l"."id"
					LEFT JOIN "homework"."homework_template" AS "ht" ON "ht"."id" = "htl"."homework_template_id"
					LEFT JOIN "homework"."homework" AS "h" ON "h"."homework_template_id" = "ht"."id"
			WHERE
				"h"."created_by" = $1
		)
	`
	args3 := []interface{}{teacherID}
	err = postgresRepository.Database.QueryRowx(query3, args3...).Scan(&homeworkCount)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return
	}
	return
}
