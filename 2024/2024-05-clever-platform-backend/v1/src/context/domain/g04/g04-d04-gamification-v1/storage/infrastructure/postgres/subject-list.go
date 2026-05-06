package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-gamification-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) SubjectList(filter *constant.SubjectFilter, pagination *helper.Pagination) ([]constant.SubjectEntity, error) {
	query := `
		SELECT
			"s"."id",
			"s"."name"
		FROM "subject"."subject" s
		LEFT JOIN
			"curriculum_group"."subject_group" sg
			ON "s"."subject_group_id" = "sg"."id"
		WHERE
		    TRUE
`
	args := []interface{}{}
	argsIndex := 1

	if filter.SubjectGroupId != 0 {
		query += fmt.Sprintf(` AND "sg"."id" = $%d`, argsIndex)
		args = append(args, filter.SubjectGroupId)
		argsIndex++
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "s"."id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	subjectEntities := []constant.SubjectEntity{}
	err := postgresRepository.Database.Select(&subjectEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return subjectEntities, nil
}
