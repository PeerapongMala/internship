package postgres

import (
	"fmt"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d07-teacher-reward-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) TeacherSubjectList(teacherId string, pagination *helper.Pagination) ([]constant.TeacherSubject, error) {
	query := `
	SELECT DISTINCT ON ("s"."id")
	"s"."id" AS "subject_id",
	"s"."name" AS "subject_name"
	FROM "subject"."subject_teacher" st
	LEFT JOIN "subject"."subject" s
	ON "st"."subject_id" = "s"."id"
	WHERE "st"."teacher_id" = $1
	`

	countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
	err := postgresRepository.Database.QueryRow(countQuery, teacherId).Scan(&pagination.TotalCount)
	if err != nil {
		return nil, err
	}
	query += ` ORDER BY "s"."id" LIMIT $2 OFFSET $3`
	response := []constant.TeacherSubject{}
	err = postgresRepository.Database.Select(&response, query, teacherId, pagination.Limit, pagination.Offset)
	if err != nil {
		return nil, err
	}
	return response, nil
}
