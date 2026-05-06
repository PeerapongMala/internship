package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d08-teacher-item-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) TeacherItemGroupList(pagination *helper.Pagination, teacherId string, filter *constant.TeacherItemGroupFilter) ([]constant.TeacherItemGroupEntity, error) {
	query := `
		SELECT DISTINCT ON ("tig"."subject_id")
		    "tig"."subject_id" AS "id",
			"sy"."short_name" AS "year",
			"s"."name" AS "subject",
			"tig"."updated_at",	
			"u"."first_name" AS "updated_by"
		FROM
		    "subject"."subject_teacher" st
		LEFT JOIN
			"teacher_item"."teacher_item_group" tig
		    ON "st"."subject_id" = "tig"."subject_id"
		LEFT JOIN
			"user"."user" u ON "tig"."updated_by" = "u"."id"
		LEFT JOIN
			"subject"."subject" s ON "tig"."subject_id" = "s"."id"
		LEFT JOIN
			"curriculum_group"."subject_group" sg ON "s"."subject_group_id" = "sg"."id"
		LEFT JOIN
			"curriculum_group"."year" y ON "sg"."year_id" = "y"."id"
		LEFT JOIN
			"curriculum_group"."seed_year" sy ON "y"."seed_year_id" = "sy"."id"
		WHERE
			"st"."teacher_id" = $1
			AND "tig"."subject_id" IS NOT NULL
	`
	args := []interface{}{teacherId}
	argsIndex := len(args) + 1

	if filter.Id != 0 {
		query += fmt.Sprintf(` AND "tig"."subject_id" = $%d`, argsIndex)
		args = append(args, filter.Id)
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
		query += fmt.Sprintf(` ORDER BY "tig"."subject_id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	teacherItemGroupEntities := []constant.TeacherItemGroupEntity{}
	err := postgresRepository.Database.Select(&teacherItemGroupEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return teacherItemGroupEntities, nil
}
