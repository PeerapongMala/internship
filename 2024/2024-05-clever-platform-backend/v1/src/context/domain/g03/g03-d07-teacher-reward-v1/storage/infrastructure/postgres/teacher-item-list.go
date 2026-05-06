package postgres

import (
	"fmt"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d07-teacher-reward-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) TeacherItem(teacherId string, subjectId int, pagination *helper.Pagination) ([]constant.ItemReponse, error) {
	query := `
	SELECT
	"i"."id" AS "item_id",
	"i"."name" AS "item_name"
	FROM "item"."item" i 
	LEFT JOIN "teacher_item"."teacher_item_group" tig
		ON "i"."teacher_item_group_id" = "tig"."id"
	WHERE "tig"."teacher_id" = $1
	AND "tig"."subject_id" = $2
	AND "i"."status" = 'enabled'
	`
	response := []constant.ItemReponse{}

	countQuery := fmt.Sprintf(`SELECT COUNT (*) FROM (%s)`, query)
	err := postgresRepository.Database.QueryRow(countQuery, teacherId, subjectId).Scan(&pagination.TotalCount)
	if err != nil {
		return nil, err
	}
	query += fmt.Sprintf(` ORDER BY "i"."id" LIMIT $3 OFFSET $4`)
	err = postgresRepository.Database.Select(&response, query, teacherId, subjectId, pagination.Limit, pagination.Offset)
	if err != nil {
		return nil, err
	}
	return response, nil
}
