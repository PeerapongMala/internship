package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d01-teacher-dashboard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository postgresRepository) GetSubjectFromClassIds(classIds []int, pagination *helper.Pagination) (entities []constant.SubjectEntity, err error) {
	query := `
		SELECT DISTINCT ON ("ss"."id")
			"ss".*
		FROM
			"class"."class" cc
				LEFT JOIN "school"."school" s
					ON "cc"."school_id" = "s"."id"
				LEFT JOIN "school"."school_subject" sss
					on "s"."id" = "sss"."school_id"
				LEFT JOIN "subject"."subject" ss
					ON "sss"."subject_id" = "ss"."id"
				LEFT JOIN "curriculum_group"."subject_group" cgsg
					ON "ss"."subject_group_id" = "cgsg"."id"
				LEFT JOIN "curriculum_group"."year" cgy
					ON "cgsg"."year_id" = "cgy"."id"
				LEFT JOIN "curriculum_group"."seed_year" cgsy
					ON "cgy"."seed_year_id" = "cgsy"."id"
		WHERE
			"cc"."year" = "cgsy"."short_name"
	`
	args := []interface{}{}
	argsIndex := 1

	if len(classIds) > 0 {
		query += fmt.Sprintf(` AND "cc"."id" = ANY($%d)`, argsIndex)
		args = append(args, classIds)
		argsIndex++
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(
			countQuery,
			args...,
		).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	rows, err := postgresRepository.Database.Queryx(query, args...)
	if err != nil {
		return
	}
	defer rows.Close()

	for rows.Next() {
		item := constant.SubjectEntity{}
		err = rows.StructScan(&item)
		if err != nil {
			return
		}
		entities = append(entities, item)
	}
	return
}
