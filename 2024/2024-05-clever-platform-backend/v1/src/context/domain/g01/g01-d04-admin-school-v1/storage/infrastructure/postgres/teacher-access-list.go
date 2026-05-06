package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) TeacherAccessList(pagination *helper.Pagination) ([]constant.TeacherAccessEntity, error) {
	query := `
		SELECT
			"id" AS "teacher_access_id",
			"access_name"
		FROM
			"auth"."teacher_access"
	`
	if pagination != nil {
		countQuery := fmt.Sprintf(` SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	}

	query += fmt.Sprintf(` ORDER BY id LIMIT $1 OFFSET $2`)

	teacherAccessEntities := []constant.TeacherAccessEntity{}
	err := postgresRepository.Database.Select(&teacherAccessEntities, query, pagination.Limit, pagination.Offset)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return teacherAccessEntities, nil
}
